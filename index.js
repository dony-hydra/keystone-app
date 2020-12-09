const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { Text, Checkbox, Password, Relationship } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { KnexAdapter } = require('@keystonejs/adapter-knex');

const { createItems } = require('@keystonejs/server-side-graphql-client');

// const TodoSchema = require('./lists/Todo');
// const UserSchema = require('./lists/User');

const keystone = new Keystone({
    adapter: new KnexAdapter({
        knexOptions: {
            connection: 'postgres://localhost/blog',
        },
        dropDatabase:true
    },),
    onConnect: async keystone => {
        // 1. Insert the user list first as it has no associated relationship
        const users = await createItems({
            keystone,
            listKey: 'User',
            items: [
                { data: { name: 'John Duck', email: 'john@duck.com', password: 'dolphins' } },
                { data: { name: 'Barry', email: 'bartduisters@bartduisters.com', password: 'dolphins' } },
            ],
            returnFields: 'id,name',
        });

        // 2. Insert `Post` data, with the required relationships, via `connect` nested mutation
        await createItems({
            keystone,
            listKey: 'Post',
            items:[
                {
                    data: {
                        title: 'Hello World',
                        author: {
                            connect: {
                                id: users.find(users => users.name === 'John Duck').id
                            }
                        }
                    }
                }
            ]
        })
    }
});

keystone.createList('User', {
    fields: {
      name: { type: Text },
      email: {
        type: Text,
        isUnique: true,
      },
      isAdmin: { type: Checkbox },
      password: {
        type: Password,
      },
    },
});

keystone.createList('Post', {
    fields: {
      title: {
        type: Text,
      },
      author: {
        type: Relationship,
        ref: 'User',
      },
    },
  });


const authStrategy = keystone.createAuthStrategy({
    type: PasswordAuthStrategy,
    list: 'User',
  });

// keystone.createList('Todo', TodoSchema);
// keystone.createList('User', UserSchema);

module.exports = {
  keystone,
  apps: [
      new GraphQLApp(),
      new AdminUIApp({name: 'keystone', enableDefaultRoute:true, authStrategy})
    ],
};
