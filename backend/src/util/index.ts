import * as path from "path";
import * as fs from "fs"
import {QueryEntity} from "./entities/query.entity";
import * as _ from "lodash";
import {Prisma} from "@prisma/client";
import {ResponseEntity} from "./entities/response.entity";
import {FilterEntity} from "./entities/filter.entity";
import {ConstraintsEntity} from "./entities/constraints.entity";
import {QueryParamEntity} from "./entities/queryParam.entity";
import {registerDecorator, ValidationOptions} from "class-validator";
import {UserExistsRule} from "./rules/UserExists.rule";
import {Injectable} from "@nestjs/common";
import {LogEntity} from "../log/entities/log.entity";

@Injectable()
export default class UtilIndex{

}

export function isEmpty(obj): Object {
  return (obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype) ? null : obj
}

export function randomString(length = 10) {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

export function randomDate() {
  let month = randomNumber(12, 1).toString()
  month = month.length > 1 ? month : `0${month}`

  let day = randomNumber(28, 1).toString()
  day = day.length > 1 ? day : `0${day}`

  return `${randomNumber(2000, 1990)}-${month}-${day}T00:00:00.000Z`;
}

export function randomNumber(max = 300000, min=0): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const fullPathToTranslates = path.resolve(__dirname + '/../../../assets/translates/');

export function getTraslates() {
  const kr = fs.readFileSync(fullPathToTranslates + '/kr.json', {encoding: 'utf8', flag: 'r'})
  const uz = fs.readFileSync(fullPathToTranslates + '/uz.json', {encoding: 'utf8', flag: 'r'})
  const ru = fs.readFileSync(fullPathToTranslates + '/ru.json', {encoding: 'utf8', flag: 'r'})
  return {
    kr: JSON.parse(kr),
    uz: JSON.parse(uz),
    ru: JSON.parse(ru)
  }
}

export function getTraslate(lang: string, phrase: string, findedItems?: object, i?: number) {
  if (!i) i = 0
  const phrases = phrase.split('.')
  if (!findedItems) {
    findedItems = JSON.parse(fs.readFileSync(fullPathToTranslates + '/' + lang + '.json', {
      encoding: 'utf8',
      flag: 'r'
    }))
  }
  findedItems = findedItems[phrases[i]]
  i = i + 1
  if (findedItems && typeof findedItems === "string") {
    return findedItems
  } else if (typeof findedItems === "object" && Object.keys(findedItems).length) {
    return getTraslate(lang, phrase, findedItems, i)
  }
  return phrase
}

export function prepareQuery(queryParams): QueryEntity {
  let query = new QueryEntity()
  if (queryParams.sortField) {
    query.orderBy[queryParams.sortField] = queryParams.sortOrder === 1 ? 'asc' : 'desc'
  }
  let n = 0
  _.forEach(queryParams.filters, (item: FilterEntity, key) => {
    if (key !== 'global') {
      // if (!(query.where['AND'] instanceof Array)) {
      //     query.where['AND'] = []
      // }
      // query.where['AND'][n] = {}
      // query.where['AND'][n][key] = {}
      // query.where['AND'][n][key]['contains'] = queryParams.filters.global.value
      if (!(query.where[item.operator.toUpperCase()] instanceof Array)) {
        query.where[item.operator.toUpperCase()] = []
      }
      _.forEach(item.constraints, (constraint) => {
        if (constraint.value !== null && constraint.value) {
          query.where[item.operator.toUpperCase()][n] = {}
          query.where[item.operator.toUpperCase()][n][key] = {}
          query.where[item.operator.toUpperCase()][n][key][constraint.matchMode] = constraint.value
          n++
        }
      })
    }
  })
  return query
}

export async function prepareSqlQuery(queryParams, prisma, table): Promise<ResponseEntity> {
  let res = new ResponseEntity()
  let fields = Object.keys(queryParams.filters)
  let strings = [`SELECT COUNT(*) FROM ${table} `]
  let values = []
  let indexStrings = 0
  _.forEach(queryParams.filters, (item: FilterEntity, key) => {
    if (key !== 'global') {
      _.forEach(item.constraints, (constraint) => {
        if (constraint.value !== null) {
          let query = getSqlOperator(constraint, key)
          if (indexStrings === 0) {
            strings = []
            query.string = `SELECT COUNT(*) FROM ${table} WHERE (${query.string}`
          } else {
            query.string = ` AND ${query.string}`
          }
          strings.push(query.string)
          values.push(query.value)
          indexStrings++
        }
      })
    }
  })
  _.forEach(fields.filter(item => item !== 'global'), (field, index) => {
    if (index === 0) {
      strings.push(`) AND ( ${field} LIKE `)
    } else {
      strings.push(` OR ${field} LIKE `)
    }
    values.push(`%${queryParams.filters.global.value}%`)
  })
  strings.push(') ')
  let query = Prisma.sql(strings, ...values)
  res.totalRecords = await prisma.$queryRaw(query)
  res.totalRecords = res.totalRecords[0]['COUNT(*)']
  strings[0] = strings[0].replace('COUNT(*)', '*')
  strings[strings.length-1] = strings[strings.length-1].replace(') ', `) ORDER BY ${queryParams.sortField} ${queryParams.sortOrder === 1 ? 'ASC' : 'DESC'} LIMIT `)
  values.push(queryParams.rows)
  strings.push(` OFFSET `)
  values.push(queryParams.first)
  strings.push('')
  query = Prisma.sql(strings, ...values)

  res.items = await prisma.$queryRaw(query)
  return res
}

export async function prepareRowQuery(queryParams: QueryParamEntity, prisma, table): Promise<ResponseEntity> {
  let res = new ResponseEntity()
  let fields = queryParams.filters.global.fields
  let strings = [`SELECT COUNT(*) FROM ${table} `]
  let values = []
  let indexStrings = 0
  _.forEach(queryParams.filters, (item: ConstraintsEntity, key) => {
    if (key !== 'global') {
      if (item.value !== null) {
        let query = getSqlOperator(item, key)
        if (indexStrings === 0) {
          strings = []
          query.string = `SELECT COUNT(*) FROM ${'`'+table+'`'} WHERE (${query.string}`
        } else {
          query.string = ` AND ${query.string}`
        }
        strings.push(query.string)
        values.push(query.value)
        indexStrings++
      }
    }
  })
  _.forEach(fields.filter(item => item !== 'global'), (field, index) => {
    if (index === 0) {
      strings.push(`) AND ( ${field} LIKE `)
    } else {
      strings.push(` OR ${field} LIKE `)
    }
    values.push(`%${queryParams.filters.global.value}%`)
  })
  strings.push(') ')
  let query = Prisma.sql(strings, ...values)
  res.totalRecords = await prisma.$queryRaw(query)
  res.totalRecords = res.totalRecords[0]['COUNT(*)']
  strings[0] = strings[0].replace('COUNT(*)', '*')
  strings[strings.length-1] = strings[strings.length-1].replace(') ', `) ORDER BY ${queryParams.sortField} ${queryParams.sortOrder === 1 ? 'ASC' : 'DESC'} LIMIT `)
  values.push(queryParams.rows)
  strings.push(` OFFSET `)
  values.push(queryParams.first)
  strings.push('')
  query = Prisma.sql(strings, ...values)
  res.items = await prisma.$queryRaw(query)
  return res
}

export function getSqlOperator({matchMode, value}, field): { string: string, value: string } {
  let res
  switch (matchMode) {
    case 'startsWith': {
      res = {string: ` ${field} LIKE `, value: `${value}%`}
      break
    }
    case 'contains': {
      res = {string: ` ${field} LIKE `, value: `%${value}%`}
      break
    }
    case 'notContains': {
      res = {string: ` ${field} NOT LIKE `, value: `%${value}%`}
      break
    }
    case 'endsWith': {
      res = {string: ` ${field} LIKE `, value: `%${value}`}
      break
    }
    case 'equals': {
      res = {string: ` ${field} = `, value: value}
      break
    }
    case 'notEquals': {
      res = {string: ` ${field} != `, value: `${value}`}
      break
    }
    case 'in': {
      res = {string: ` ${field} IN `, value: `${value}`}
      break
    }
    case 'between': {
      res = {string: ` ${field} IN `, value: `${value}`}
      break
    }
    case 'lt': {
      res = {string: ` ${field} < `, value: `${value}`}
      break
    }
    case 'lte': {
      res = {string: ` ${field} <= `, value: `${value}`}
      break
    }
    case 'gt': {
      res = {string: ` ${field} > `, value: `${value}`}
      break
    }
    case 'gte': {
      res = {string: ` ${field} >= `, value: `${value}`}
      break
    }
  }
  return res
}

export function uppercaseFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
export const localMode="local"

export function getDaysArray(year, month) {
  let date = new Date(year, month - 1, 1);
  let result = [];
  while (date.getMonth() == month - 1) {
    let day = {day: null, weekday: null}
    day.day = date.getDate()
    day.weekday = daysOfWeek[date.getDay()]
    result.push(day);
    date.setDate(date.getDate() + 1);
  }
  return result;
}

export function isImage(mimetype: string) {
  return mimetype.match(/\/(jpg|jpeg|png|gif)$/) !== null
}

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const atob = require("atob");
export const parseJwt = function(token: string) {
  token = token.split(' ')[1]
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

export function UniqueUsername(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UserExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserExistsRule,
    });
  };
}

export async function createLog(data: any, action: string, table: string) {
  if (data) {
    const logDto = new LogEntity()
    logDto.data = JSON.stringify(data)
    logDto.entity = table
    logDto.entity_id = data.id
    logDto.action = action
    await prisma.log.create({data: logDto})
  }
}

export async function createLogs(data: any[], action: string, table: string) {
  if (data.length) {
    const datas = []
    data.forEach((item) => {
      const logDto = new LogEntity()
      logDto.data = JSON.stringify(item)
      logDto.entity = table
      logDto.entity_id = item.id
      logDto.action = action
      datas.push(logDto)
    })
    await prisma.log.createMany({data: datas})
  }

}
