import {randomDate, randomNumber, randomString} from "../../src/util";
import {faker} from "@faker-js/faker"

let data = []
data.push({
    "user_id": 1,
    "password": "0142",
    "roleId": 1,
    "full_name": "Anvajon Abdullajonov",
    "phone": `937858104`,
}, {
    "user_id": 2,
    "password": "test",
    "roleId": 2,
    "full_name": "Test Driver",
    "phone": `333333333`,
})
// for (let i = 2; i <= 20; i++) {
//   let fakeUser = faker.fake('{{internet.email}};{{name.firstName}};{{name.lastName}};{{address.city}}').split(';')
//   data.push({
//     "user_id": i,
//     "password": "1234",
//     "roleId": 2,
//     "full_name": fakeUser[1],
//     "phone": `(998)${randomNumber(999999999, 333333333)}`,
//   })
// }
const student = {
    tag: 'user',
    data: data
}
export default student