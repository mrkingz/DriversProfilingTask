const { uuid } = require('uuidv4');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('Associations', [{
      id: uuid(),
      name: 'Lekki Routes Mini bus drivers',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuid(),
      name: 'Ikeja-Oshodi danfo drivers',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuid(),
      name: 'Mainland-Island terminal bus drivers',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('Associations', null, {});
  }
};
