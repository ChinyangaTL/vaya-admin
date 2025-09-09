import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(67890)

export const users = Array.from({ length: 50 }, () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    email: faker.internet.email({ firstName }).toLocaleLowerCase(),
    phone: faker.phone.number({ style: 'international' }),
    role: faker.helpers.arrayElement([
      'RIDER',
      'DRIVER',
      'FLEET_MANAGER',
      'ADMIN',
    ]),
    is_active: faker.datatype.boolean(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    // Optional fields
    first_name: firstName,
    last_name: lastName,
    profile_picture: faker.image.avatar(),
  }
})
