export default class UserQueryDto {
  constructor(request) {
    Object.keys(request).forEach(key => {
      request[key] = JSON.parse(request[key])
    })
    return request
  }

  where: object
}