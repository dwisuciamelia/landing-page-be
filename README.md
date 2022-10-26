```js
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'users',
        'inactive',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'users',
        'activationToken',
        {
          type: Sequelize.STRING,
          defaultValue: true,
        },
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('users', 'inactive');
      await queryInterface.removeColumn('users', 'activationToken');
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },
};
```