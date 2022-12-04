const adminPermissions = []
for (let i = 1; i <= 52; i++) {
  adminPermissions.push({id: i})
}
const managerPermissions = adminPermissions.filter(item => {
  return ![4, 15, 16, 25, 26, 27, 28, 33, 34, 35, 36, 37, 39, 40, 45, 46, 47, 48].includes(item.id)
})

const role = {
  tag: 'role',
  data: [
    {
      id: 1,
      tag: "admin",
      description: "Admin",
      Permissions: {
        connect: adminPermissions
      }
    },
    {
      id: 2,
      tag: "teacher",
      description: "Teacher",
      Permissions: {
        connect: [{id: 6}, {id: 10}, {id: 14}, {id: 18}, {id: 22}]
      }
    },
    {
      id: 3,
      tag: "student",
      description: "Student",
    },
    {
      id: 4,
      tag: "manager",
      description: "Manager",
      Permissions: {
        connect: managerPermissions
      }
    },
  ]
}

export default role