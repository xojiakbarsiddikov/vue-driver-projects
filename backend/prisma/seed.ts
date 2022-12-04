import user from "./seeders/user.seed";
import role from "./seeders/role.seed";
import permission from "./seeders/permission.seed";

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const seedData = [
    permission,
    role,
    user,
]

async function main() {
    for (let i = 0; i < seedData.length; i++) {
        for (let j = 0; j < seedData[i]['data'].length; j++) {
            try {
                await prisma[seedData[i]['tag']].create({
                    data: seedData[i]['data'][j]
                })
            } catch (e) {
                console.log(seedData[i]['data'][j])
            }
        }
        console.log(seedData[i]['tag'])
    }
}

main().catch(e => {
    console.log(e)
    process.exit(1)
}).finally(() => {
    console.log("\ndone")
    prisma.$disconnect()
})