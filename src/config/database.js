module.exports = {
  dialect: 'mssql',
  dialectOptions: {
    options: {
      useUTC: false,
      dateFirst: 1,
    },
  },
  host: 'localhost',
  username: 'sa',
  password: 'yourStrong(!)Passw0rd',
  database: 'quiver',
  define: {
    timestamps: true,
  },
};
