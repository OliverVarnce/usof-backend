'use strict';
const moment = require('moment');

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('Posts', [
      {
        authorId: 2,
        title: 'recovery of multiple downloaded image in formData with express',
        published: 1,
        story: '<p>Hello sorry for my english, i have a little problem. i try to upload many images but in back side i have just one image, (i use React express formidable cloudinary) here is my code front :</p>' +
            'const [arrayFiles, setArrayFiles] = useState([]);\n' +
            '\n' +
            ' const handleFiles = (e) => {\n' +
            '  let arrayUpload = [...arrayFiles];\n' +
            '  arrayUpload.push(e.target.files[0]);\n' +
            '  setArrayFiles(arrayUpload);\n' +
            '\n' +
            '\n' +
            '  let arrayPrevious = [...previousImg];\n' +
            '  arrayPrevious.push(URL.createObjectURL(e.target.files[0]));\n' +
            '  setPreviousImg(arrayPrevious);\n' +
            ' };\n' +
            '\n' +
            'const handleSubmit = async (e) => {\n' +
            '  arrayFiles.forEach((file) => {\n' +
            '  formData.append("image", file);\n' +
            '});\n' +
            '\n' +
            'const response = await axios.post(\n' +
            '  "http://localhost:3100/offer/publish",\n' +
            '  formData\n' +
            ');',
        createdAt: moment.utc().format('2021-02-18 12:04:12'),
        updatedAt: moment.utc().format('2021-02-18 12:04:12')
      },
       {
         authorId: 3,
         title: 'sequelize.js TIMESTAMP не DATETIME',
         published: 1,
         story: 'В моем приложении node.js у меня есть несколько моделей, в которых я хочу определить столбцы типа TIMESTAMP , включая временные метки по умолчанию created_at и updated_at .\n' +
             '\n' +
             'Согласно документации sequelize.js\', существует только тип данных DATE . Он создает DATETIME столбца в MySQL.\n' +
             '\n' +
             'Пример:\n' +
             '\n' +
             'var User = sequelize.define(\'User\', {\n' +
             '... // columns\n' +
             'last_login: {\n' +
             '            type: DataTypes.DATE,\n' +
             '            allowNull: false\n' +
             '        },\n' +
             '...\n' +
             '}, { // options\n' +
             '        timestamps: true\n' +
             '});\n' +
             'Можно ли вместо этого сгенерировать TIMESTAMP столбца?',
         createdAt: moment.utc().format('2021-02-19 13:02:12'),
         updatedAt: moment.utc().format('2021-02-19 13:02:12')
       },
       {
         authorId: 4,
         title: 'Как проверить, содержит ли строка определенное слово?',
         published: 1,
         story: 'Считать:\n' +
             '\n' +
             '$a = \'How are you?\';\n' +
             '\n' +
             'if ($a contains \'are\')\n' +
             '    echo \'true\';\n' +
             'Предположим, у меня есть приведенный выше код, Как правильно написать оператор if ($a contains \'are\') ?',
         createdAt: moment.utc().format('2021-03-01 08:02:11'),
         updatedAt: moment.utc().format('2021-02-01 08:02:11')
       },
       {
         authorId: 5,
         title: 'Как я могу получить PHP ошибок для отображения?',
         published: 1,
         story: 'Я проверил свой файл PHP ini ( php.ini ) и display_errors установлен, а также отчет об ошибках E_ALL . Я перезапустил свой Apache webserver.\n' +
             '\n' +
             'Я даже поместил эти строки в верхней части своего скрипта, и он даже не улавливает простых ошибок синтаксического анализа. Например, я объявляю переменные с "$" и не закрываю операторы ";" . Но все мои скрипты показывают пустую страницу об этих ошибках, но я действительно хочу видеть ошибки в выводе моего браузера.\n' +
             '\n' +
             'error_reporting(E_ALL);\n' +
             'ini_set(\'display_errors\', 1);\n' +
             'Что же остается делать?',
         createdAt: moment.utc().format('2021-03-05 05:02:11'),
         updatedAt: moment.utc().format('2021-02-05 05:02:11')
       },
       {
         authorId: 5,
         title: 'Как мне обновить Node.js?',
         published: 1,
         story: 'Я сделал следующее, Чтобы обновить свой npm:\n' +
             '\n' +
             'npm update npm -g\n' +
             'Но я понятия не имею, как обновить Node.js. Есть предложения? (Я использую Node.js 0.4.1 и хочу обновить его до Node.js 0.6.1.)',
         createdAt: moment.utc().format('2021-03-11 16:02:11'),
         updatedAt: moment.utc().format('2021-02-11 16:02:11')
       },
     ], {});
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Posts', null, {});
  }
};
