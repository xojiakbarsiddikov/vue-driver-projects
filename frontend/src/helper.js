import axios from "axios";
import moment from "moment-timezone";
import * as _ from "lodash"
import router from "./router";

export const API_URL = `${process.env.VUE_APP_BACKEDN_URL}`
export const API_FILE_URL = `${API_URL}upload/file/`;
export const APP_VERSION = '1.1.5'

export function findIndexById(id, array) {
    let index = -1;
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
}

export const showToast = function (toast, status, title, message, life = 3000) {
    toast.add({
        severity: status,
        summary: title,
        detail: message,
        life: life
    });
}
export const languages = [
    {
        id: "uz",
        name: "O`zbekcha"
    },
    {
        id: "ru",
        name: "Русский"
    },
    {
        id: "en",
        name: "English"
    },
    {
        id: "kr",
        name: "Кирилча"
    }
]

export const loadTranslates = async function () {
    return axios.get(API_URL + 'helpers/get-translates').then(res => res.data).then(res => {
        return res
    }).catch(e => {
        if (e.response && e.response.data.status === 303) {
            window.location.href = 'https://normsys.uz'
        }
    })
}

export const errorHandling = function (error, $t, $toast) {
    let message = $t('unknown_error')
    let errors = []
    if (error.response && [403, 404].includes(error.response.status)) {
        message = $t(error.response.data.message)
    } else if (error.response && error.response.status === 400) {
        message = $t('crud_table.form_input_error')
        errors = error.response.data
    } else if (error.response && error.response.status === 401) {
        if (error.response.data.message === "Unauthorized") {
            router.go({name: 'Login'})
        }
        message = $t('crud_table.form_input_error')
        errors = []
    } else if (error.response && error.response.data.status === 303) {
        window.location.href = 'https://normsys.uz'
    }
    try {
        showToast($toast, 'error', $t('error_occurred'), $t(message))
    } catch (e) {
        console.log(e)
    }
    return errors
}

const userUrls = ['user', 'teacher', 'student']

export const saveOrUpdate = function (item, $toast, $t, url) {
    if ( (item.id && !userUrls.includes(url)) || (item.user_id && userUrls.includes(url)) ) {
        url = item.id ? `${url}/${item.id}` : `${url}/${item.user_id}`
        return axios.patch(API_URL + url, item).then(res => {
            showToast($toast, 'success', $t('success'), $t('updated'))
            return res.data
        })
    } else {
        return axios.post(API_URL + url, item).then(res => {
            showToast($toast, 'success', $t('success'), $t('created'))
            return res.data
        })
    }
}

export const deleteRecords = async function (items, $confirm, $t, $toast, url) {
    let ids = items.map(item => item.id)
    if (userUrls.includes(url)) {
        ids = items.map(item => item.user_id)
    }
    return new Promise((resolve) => {
        $confirm.require({
            message: '',
            acceptLabel: $t('crud_table.confirm_yes'),
            rejectLabel: $t('crud_table.confirm_no'),
            header: $t('confirm_delete'),
            accept: () => {
                axios.post(API_URL + url + '/delete-many', {ids}).then(() => {
                    showToast($toast, 'success', $t('success'), $t('course.name') + $t('deleted'))
                    resolve(ids)
                }).catch(e => {
                    errorHandling(e, $t, $toast)
                })
            },
            reject: () => {

            }
        })
    })

}

export const lazyParams = function ($refs, filters, sortField = 'id') {
    return {
        first: 0,
        rows: $refs.dt.rows,
        sortField: sortField,
        sortOrder: -1,
        filters: filters
    }
};

export function throttle (callback, limit) {
    var wait = false;
    return function () {
        if (!wait) {
            wait = true;
            setTimeout(function () {
                wait = false;
                callback.call();
            }, limit);
        }
    }
}

export function timeFromDate(date) {
    return moment.tz(date, 'Asia/Tashkent').format('HH:mm')
}

export const translateDefaultStrings = function (primevue, t) {
    primevue.config.locale.startsWith = t('locale.startsWith')
    primevue.config.locale.contains = t('locale.contains')
    primevue.config.locale.notContains = t('locale.notContains')
    primevue.config.locale.endsWith = t('locale.endsWith')
    primevue.config.locale.equals = t('locale.equals')
    primevue.config.locale.notEquals = t('locale.notEquals')
    primevue.config.locale.noFilter = t('locale.noFilter')
    primevue.config.locale.lt = t('locale.lt')
    primevue.config.locale.lte = t('locale.lte')
    primevue.config.locale.gt = t('locale.gt')
    primevue.config.locale.gte = t('locale.gte')
    primevue.config.locale.dateIs = t('locale.dateIs')
    primevue.config.locale.dateIsNot = t('locale.dateIsNot')
    primevue.config.locale.dateBefore = t('locale.dateBefore')
    primevue.config.locale.dateAfter = t('locale.dateAfter')
    primevue.config.locale.clear = t('locale.clear')
    primevue.config.locale.apply = t('locale.apply')
    primevue.config.locale.matchAll = t('locale.matchAll')
    primevue.config.locale.matchAny = t('locale.matchAny')
    primevue.config.locale.addRule = t('locale.addRule')
    primevue.config.locale.removeRule = t('locale.removeRule')
    primevue.config.locale.accept = t('locale.accept')
    primevue.config.locale.reject = t('locale.reject')
    primevue.config.locale.choose = t('locale.choose')
    primevue.config.locale.upload = t('locale.upload')
    primevue.config.locale.cancel = t('locale.cancel')
    primevue.config.locale.dayNames = [
        t('locale.dayNames.Monday'),
        t('locale.dayNames.Tuesday'),
        t('locale.dayNames.Wednesday'),
        t('locale.dayNames.Thursday'),
        t('locale.dayNames.Friday'),
        t('locale.dayNames.Saturday'),
        t('locale.dayNames.Sunday'),
    ]
    primevue.config.locale.dayNamesShort = [
        t('locale.dayNamesShort.Mon'),
        t('locale.dayNamesShort.Tue'),
        t('locale.dayNamesShort.Wed'),
        t('locale.dayNamesShort.Thu'),
        t('locale.dayNamesShort.Fri'),
        t('locale.dayNamesShort.Sat'),
        t('locale.dayNamesShort.Sun'),
    ]
    primevue.config.locale.dayNamesMin = [
        t('locale.dayNamesMin.Mo'),
        t('locale.dayNamesMin.Tu'),
        t('locale.dayNamesMin.We'),
        t('locale.dayNamesMin.Th'),
        t('locale.dayNamesMin.Fr'),
        t('locale.dayNamesMin.Sa'),
        t('locale.dayNamesMin.Su'),
    ]
    primevue.config.locale.monthNames = [
        t('locale.monthNames.January'),
        t('locale.monthNames.February'),
        t('locale.monthNames.March'),
        t('locale.monthNames.April'),
        t('locale.monthNames.May'),
        t('locale.monthNames.June'),
        t('locale.monthNames.July'),
        t('locale.monthNames.August'),
        t('locale.monthNames.September'),
        t('locale.monthNames.October'),
        t('locale.monthNames.November'),
        t('locale.monthNames.December'),
    ]
    primevue.config.locale.monthNamesShort = [
        t('locale.monthNamesShort.Jan'),
        t('locale.monthNamesShort.Feb'),
        t('locale.monthNamesShort.Mar'),
        t('locale.monthNamesShort.Apr'),
        t('locale.monthNamesShort.May'),
        t('locale.monthNamesShort.Jun'),
        t('locale.monthNamesShort.Jul'),
        t('locale.monthNamesShort.Aug'),
        t('locale.monthNamesShort.Sep'),
        t('locale.monthNamesShort.Oct'),
        t('locale.monthNamesShort.Nov'),
        t('locale.monthNamesShort.Dec'),
    ]
    primevue.config.locale.today = t('locale.today')
    primevue.config.locale.weekHeader = t('locale.weekHeader')
    primevue.config.locale.firstDayOfWeek = t('locale.firstDayOfWeek')
    primevue.config.locale.dateFormat = t('locale.dateFormat')
    primevue.config.locale.weak = t('locale.weak')
    primevue.config.locale.medium = t('locale.medium')
    primevue.config.locale.strong = t('locale.strong')
    primevue.config.locale.passwordPrompt = t('locale.passwordPrompt')
    primevue.config.locale.emptyFilterMessage = t('locale.emptyFilterMessage')
    primevue.config.locale.emptyMessage = t('locale.emptyMessage')
}

export function checkForNew(id, ref, $toast, $t) {
    if (!id) {
        ref.clear()
        showToast($toast, 'error', $t('error'), $t('item_not_saved'))
    }
}

export function uploadFiles(form, $toast, $t, url = 'upload/') {
    return axios.post(API_URL + url, toFormData(form)).then(res => {
        showToast($toast, 'success', $t('success'), $t('saved'))
        return res.data
    })
}

export function deleteFiles(ids, $confirm, $toast, $t, url = 'upload/delete-many') {
    return new Promise((resolve) => {
        $confirm.require({
            message: '',
            acceptLabel: $t('crud_table.confirm_yes'),
            rejectLabel: $t('crud_table.confirm_no'),
            header: $t('confirm_delete'),
            accept: () => {
                axios.post(API_URL + url, {ids}).then(() => {
                    resolve(ids)
                    showToast($toast, 'success', $t('success'), $t('course.name') + $t('deleted'))
                }).catch(e => {
                    errorHandling(e, $t, $toast)
                })
            },
            reject: () => {

            }
        })
    })
}

export const toFormData = (obj, form, namespace) => {
    let fd = form || new FormData();
    let formKey;
    for (let property in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(property)) {
            if (obj[property] && obj[property]._d) {
                fd.append(property, obj[property].toISOString())
                continue
            }


            if (obj[property] instanceof File) {
                fd.append(namespace, obj[property]);
                continue
            }

            if (namespace) {
                formKey = namespace + '[' + property + ']';
            } else {
                formKey = property;
            }

            if (obj[property] === null) {
                obj[property] = ''
            }

            // if the property is an object, but not a File, use recursivity.
            if (obj[property] instanceof Date) {
                fd.append(formKey, obj[property].toISOString());
            } else if (typeof obj[property] === 'object' && !(obj[property] instanceof File) && !(obj[property] instanceof FileList)) {
                toFormData(obj[property], fd, formKey);
            } else if (obj[property] instanceof FileList) {
                _.forEach(obj[property], item => {
                    fd.append(formKey, item);
                })
            } else { // if it's a string or a File object
                fd.append(formKey, obj[property]);
            }
        }
    }

    return fd;
}

export function studentStatuses($t) {
    return [
        {
            id: 1,
            name: $t('group.status_active')
        },
        {
            id: 2,
            name: $t('group.status_inactive')
        },
    ]
}

export function formatDate(date, $t) {
    return `${moment(date).format('DD')} ${$t('locale.monthNames.' + moment(date).format('MMMM'))} ${moment(date).format('YYYY')}`
}

export function leadStatusLabel(status) {
    switch (status) {
        case 1:
            return 'new'
        case 2:
            return 'processed'
        case 3:
            return 'archived'
    }
}

export function genderOptions($t) {
    return [
        {
            id: 1,
            name: $t('male')
        },
        {
            id:2,
            name: $t('female')
        }
    ]
}

export const payoutTypes = {
    salary: 1,
    rent: 2,
    refund: 3,
    other: 4
}

export const adminRoleId = 1
export const driverRoleId = 2
export function getRoles() {
    return [
        { id: adminRoleId, tag: 'role.admin' },
        { id: driverRoleId, tag: 'role.driver' },
    ]
}

export function getRoleName(roleId) {
    let label = ''
    switch (roleId) {
        case adminRoleId:
            label = 'role.admin'
            break
        case driverRoleId:
            label = 'role.driver'
            break
        default:
            label = ''
    }
    return label
}

export function getDateByTimezone(date, timezone = timeZoneUz) {
    if (typeof date === "string") {
        date = new Date(date)
    }
    date.setHours(timezone)
    return date
}

export const timeZoneUz = 5

export const adminMenu = [
    {
        label: '/',
        items: [
            {label: 'sidebar.main', icon: 'fa fa-home', to: {name: 'AdminIndex'}},
        ]
    },
]

export const driverMenu = [
    {
        label: '/',
        items: [
            {label: 'sidebar.main', icon: 'fa fa-home', to: {name: 'DriverIndex'}},
        ]
    },
]