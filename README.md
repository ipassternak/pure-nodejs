**Виконав:** 

*студент 2-го курсу, групи ІМ-21*<span padding-right:5em></span> **Іван ПАСТЕРНАК** [Пошта: retriumpf@gmail.com, [Телеграм](https://t.me/ipassternak)]

# Розроблення веб застосунку з використанням PostgreSQL, Node.js, без фреймворків та ОRM

## Вступ

В сучасному світі веб-розробка є невід'ємною частиною інформаційних технологій, а вибір правильних технологій може визначити успіх проєкту. У цій доповіді ми розглянемо процес розроблення веб-застосунку з використанням двох ключових інструментів - PostgreSQL, як потужної системи управління базами даних, та Node.js, використовуючи його без застосування фреймворків чи об'єктно-реляційних маперів (ОRM). Поглибимося в огляд цих технологій, порівняємо їх переваги та недоліки, а також представимо навчальний приклад реалізації, надаючи інструкції з налаштування та використання.

## Огляд PostgreSQL

**PostgreSQL** – це потужна та релаційна система управління базами даних (СУБД), яка визначається відкритістю, розширюваністю та високою надійністю. Розроблена для обробки великих обсягів даних та високозавантажених додатків, PostgreSQL володіє вражаючою функціональністю та стандартністю SQL.

### Переваги PostgreSQL:

- **Розширюваність**: Здатність легко розширювати функціонал для відповіді на високі навантаження.
- **Відкритість**: PostgreSQL має відкритий вихідний код, що сприяє спільноті розробників та постійному вдосконаленню.
- **Підтримка розширень**: Можливість використання розширень для розширення функціоналу.

### Недоліки PostgreSQL:

- **Високі вимоги до ресурсів**: Для повноцінного функціонування може вимагати більших обсягів пам'яті та процесорної потужності.
- **Складність конфігурації**: Наявність великої кількості налаштувань може ускладнити процес конфігурації та оптимізації.

## Огляд ОRM

**Об'єктно-реляційне відображення (ORM)** - це технологія, яка дозволяє використовувати об'єктно-орієнтовані структури в програмуванні для роботи з реляційною базою даних. Використання ORM спрощує взаємодію з базою даних, перетворюючи дані між об'єктами в коді програми та відповідними записами в базі даних.

### Переваги використання ORM:

- **Спрощена робота з базою даних**: ORM дозволяє розробникам взаємодіяти з базою даних, використовуючи об'єктно-орієнтовані конструкції, замість роботи з SQL-запитами. Це робить код більш зрозумілим та підтримуваним.

- **Вищий рівень абстракції**: ORM надає вищий рівень абстракції над базою даних, дозволяючи розробникам уникнути прямого взаємодії з деталями SQL та спростити розробку.

- **Підтримка різних систем управління базами даних**: Багато ORM рішень підтримують різні системи управління базами даних (СУБД), що дозволяє легко змінювати базу даних без необхідності змінювати весь код програми.

### Недоліки використання ORM:

- **Втрата продуктивності**: У деяких випадках використання ORM може призвести до втрати продуктивності, оскільки вона може генерувати менш ефективні SQL-запити, ніж ті, які може написати досвідчений розробник.

- **Складність конфігурації**: Налаштування ORM може бути складним завданням, особливо при великих проєктах зі складними моделями даних.

- **Втрата контролю над оптимізацією бази даних**: Використання ORM може призвести до втрати контролю над оптимізацією бази даних, оскільки генеровані ORM-запити можуть бути менш оптимальними за ручно написані SQL-запити.

## Огляд Node.js

**Node.js** - це середовище виконання JavaScript, побудоване на рушію V8 від Google, яке використовує асинхронну модель програмування. Відзначається відкритістю, великою спільнотою розробників та швидким темпом розвитку. Основною його перевагою є здатність ефективно обробляти паралельні операції завдяки асинхронності та моделі подій (event based architecture).

### Переваги Node.js:

- **Асинхронна модель**: Забезпечує ефективну обробку багатозадачних операцій без блокування потоків.
- **Відкритість**: Node.js базується на відкритому вихідному коді, що сприяє активному внесенню в спільноті розробників.
- **Екосистема npm**: Node.js використовує пакетний менеджер npm, який має велику кількість готових пакетів та бібліотек, що значно полегшує розробку та розширення функціоналу.
- **Легка вивченість**: JavaScript є однією з найпоширеніших мов програмування, що робить Node.js доступним для великої кількості розробників, а також сприяє швидкому освоєнню новачками.

### Недоліки Node.js:

- **Менша підтримка великих обчислювальних навантажень**: Для деяких завдань, де потрібно велике обчислювальне навантаження (CPU bound), Node.js може бути менш підходящим порівняно з іншими програмними рішеннями.
- **Обмежена кількість вбудованих технологій**: Для деяких завдань може вимагати використання сторонніх бібліотек та фреймворків.

## "Чиста" Node.js: проблеми та можливі складнощі в розробці

Брак вбудованих рішень у чистій Node.js може створювати виклики для розробників, оскільки вони часто змушені писати велику кількість коду з нуля. Навіть для рутинних завдань, таких як маршрутизація HTTP-запитів або робота з шаблонами, розробники повинні самостійно вибирати та інтегрувати відповідні бібліотеки чи інструменти. Це може вимагати додаткового часу та зусиль, а також збільшувати ризик помилок, особливо якщо сторонні бібліотеки не вибрані або не налаштовані правильно.

Однією з основних проблем є неоднорідність у структурі проєктів, оскільки розробники можуть вибирати різні підходи до організації коду. Відсутність стандартного шаблону архітектури може призводити до складнощів у сприйнятті та підтримці кодовой бази різними командами розробників.

Писати все з нуля також може вимагати великої кількості часу та зусиль, особливо при розробці складних функціональностей чи великих проєктів. Водночас, це може визначати низку технічних виборів, таких як вибір бібліотек для роботи з базами даних чи для забезпечення безпеки, що може вимагати додаткових знань та досліджень з боку розробників.

У контексті цих викликів іноді розробники мають враховувати, що використання фреймворку або іншого вищеступеневого інструменту може спростити розробку та полегшити підтримку проєкту, але при цьому може втрачатися частина гнучкості та контролю.

З новими версіями Node.js вбудовані можливості значно розширюються, надаючи розробникам більше інструментів та функціоналу.

## Огляд прикладу реалізації

Основна кодова база проєкту міститься в каталозі `src`. Ключові компоненти системи:
- Logger
- Query builder (DB access)
- Loader (Routing, DI)
- HTTP Server
- Static Server
- Session

Для побудови поширених SQL запитів використовуються простий query builder:
```javascript
'use strict';

const npm = require('./npm.js');

const valueOps = {
  eq: '=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  ne: '<>',
};

const pairOps = {
  between: 'BETWEEN',
  nbetween: 'NOT BETWEEN',
};

const listOps = {
  in: 'IN',
  nin: 'NOT IN',
};

valueOps.build = (operator, i) => {
  const op = valueOps[operator];
  return { res: `${op} $${i}`, i };
};

pairOps.build = (operator, i) => {
  const op = pairOps[operator];
  return { res: `${op} $${i} AND $${i + 1}`, i: i + 1 };
};

listOps.build = (operator, i, list) => {
  const op = listOps[operator];
  const params = list.map((_, j) => `$${i + j}`).join(', ');
  return { res: `${op} (${params})`, i: i + list.length - 1 };
};

const build = (operator, i, val) => {
  for (const type of [valueOps, pairOps, listOps])
    if (type[operator]) return type.build(operator, i, val);
  throw new Error(`Invalid operator: ${operator}`);
};

const buildWhereClause = (clause) => {
  const statement = [];
  let param = 1;
  for (const [key, val] of Object.entries(clause)) {
    if (typeof val === 'object') {
      const [operator, value] = Object.entries(val)[0];
      const { res, i } = build(operator, param, value);
      param = i;
      statement.push(`${key} ${res}`);
    } else {
      statement.push(`${key} = $${param}`);
    }
    param++;
  }
  return statement.join(' AND ');
};

module.exports = (options, pool = new npm.pg.Pool(options)) => ({
  healthcheck: () => pool.query('SELECT true::BOOLEAN AS healthcheck;'),

  async query(sql, values = []) {
    const res = await pool.query(sql, values);
    return res.rows;
  },

  async findById(entity, id, fields = ['*']) {
    const columns = fields.join(', ');
    const res = await pool.query(`
      SELECT ${columns}
      FROM ${entity}
      WHERE id = $1;
    `, [id]);
    return res.rows[0];
  },

  async findMany(entity, where, fields = ['*']) {
    const columns = fields.join(', ');
    const clause = buildWhereClause(where);
    if (!clause) return this.findAll(entity, fields);
    const values = Object.values(where).map((val) =>
      typeof val === 'object' ? Object.values(val)[0] : val
    ).flat();
    const res = await pool.query(`
      SELECT ${columns}
      FROM ${entity}
      WHERE ${clause};
    `, values);
    return res.rows;
  },

  async findOne(entity, where, fields = ['*']) {
    const res = await this.findMany(entity, where, fields);
    return res[0];
  },

  async findAll(entity, fields = ['*']) {
    const columns = fields.join(', ');
    const res = await pool.query(`
      SELECT ${columns}
      FROM ${entity};
    `);
    return res.rows;
  },

  async insert(entity, data, fields = ['*']) {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const params = values.map((_, i) => `$${i + 1}`).join(', ');
    const returning = fields.join(', ');
    const res = await pool.query(`
      INSERT INTO ${entity} (${columns})
        VALUES (${params})
        RETURNING ${returning};
    `, values);
    return res.rows[0];
  },

  async updateById(entity, id, data, fields = ['*']) {
    const entries = Object
      .keys(data)
      .map((key, i) => `${key}=$${i + 2}`)
      .join(', ');
    const values = Object.values(data);
    const returning = fields.join(', ');
    const res = await pool.query(`
      UPDATE ${entity}
      SET ${entries}
      WHERE id = $1
      RETURNING ${returning};
    `, [id, ...values]);
    return res.rows[0];
  },

  async deleteById(entity, id, fields = ['*']) {
    const returning = fields.join(', ');
    const res = await pool.query(`
      DELETE FROM ${entity}
      WHERE id = $1
      RETURNING ${returning};
    `, [id]);
    return res.rows[0];
  },

  async exists(entity, id) {
    const res = await pool.query(`
        SELECT * 
        FROM ${entity}
        WHERE id = $1;
    `, [id]);
    return !!res.rows[0];
  }
});
```

Під час запуску програми **loader** завантує застосунок з каталогу `app` й парельно впроваджує необхідні залежності в кожен модуль, таким чином реалізовується так завана ***архітектура каталогів*** та ***Dependency Injectiom (DI)***, що формує надйну архітектуру системи. Далі керування потрапляє до головного контроллера, який розподіляє запити на потрібні "ендпоінти":

```javascript
'use strict';

const node = require('./node.js');
const npm = require('./npm.js');
const Session = require('./session.js');
const staticServer = require('./static.js');
const { routing, hooks } = require('./framework.js');
const { MIME_TYPES, HEADERS } = require('./constants.js');

const Validator = npm.ajv;
const validator = new Validator();

const receiveBody = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  return buffers;
};

const receiveJSON = async (req) => {
  const buffers = await receiveBody(req);
  if (buffers.length) {
    try {
      const data = Buffer.concat(buffers).toString();
      return JSON.parse(data);
    } catch (err) { /* Ignore */ }
  }
  return {};
};

const parsers = {
  'application/json': receiveJSON,
  default: () => ({}),
};

class ClientError extends Error {
  constructor(msg = '', { httpCode = 400 } = {}) {
    super(msg);
    this.httpCode = httpCode;
  }
}

module.exports = (options) => {
  const { console, host, port, prefix } = options;
  const serveStatic = options.static ? staticServer(options) : null;

  class Client {
    #req;
    #res;
    #url;
    state = {};
    Error = ClientError;

    static async decorate(req, res) {
      const contentType = req.headers['content-type'];
      const parser = parsers[contentType] || parsers.default;
      const body = await parser(req);
      const client = new Client(req, res, body);
      await hooks.emit('onRequest', client);
      return client;
    }

    constructor(req, res, body) {
      this.#req = req;
      this.#res = res;
      this.#url = new URL(req.url, `http://${req.headers.host}`);
      this.body = body;
      this.session = new Session(this);
    }

    get ip() {
      return this.#req.socket.remoteAddress;
    }

    get url() {
      return this.#url.pathname;
    }

    get method() {
      return this.#req.method;
    }

    get headers() {
      return this.#req.headers;
    }

    get host() {
      return this.#req.headers.host;
    }

    get query() {
      return this.#url.searchParams;
    }

    async error(err) {
      await hooks.emit('onError', err);
      const code = err instanceof this.Error ? err.httpCode : 500;
      const { message } = err;
      const { url, method } = this.#req;
      const status = node.http.STATUS_CODES[code];
      const pass = code < 500 || code > 599;
      const error = pass ? message : status || 'Unknown error';
      const reason = `${code}\t${message}`;
      console.error(`${this.ip}\t${method}\t${url}\t${reason}`);
      this.send({ error }, code);
    }

    async send(obj, code = 200) {
      const res = this.#res;
      if (res.writableEnded) return;
      const httpCode = obj?.httpCode;
      if (httpCode) {
        code = httpCode;
        if (obj) obj.httpCode = undefined;
      }
      const data = obj ? JSON.stringify(obj) : '';
      const session = this.session.cookie();
      if (session) res.setHeader('Set-Cookie', session);
      await hooks.emit('onSend');
      if (httpCode === 204 || !data) {
        res.writeHead(code, { ...HEADERS });
        res.end();
      } else {
        res.writeHead(code, { ...HEADERS, 'Content-Type': MIME_TYPES.json });
        res.end(data);
      }
    }
  }

  const server = node.http.createServer(async (req, res) => {
    if (!req.url.startsWith(prefix))
      return void await serveStatic(req, res);
    const client = await Client.decorate(req, res);
    const { url, method } = client;
    const resource = routing.get(url);
    const endpoint = resource?.[method.toLowerCase()];
    try {
      await hooks.emit('preValidation', client);
      if (!endpoint) return void client.error(new client.Error(
        `${method} ${url} could not be found`,
        { httpCode: 404 },
      ));
      const { body } = client;
      const { access, scheme, validate, handler } = endpoint;
      if (access !== 'public') {
        if (client.session.isEmpty())
          return void client.error(new client.Error(
            `${method} ${url} requires authorized access`,
            { httpCode: 401 },
          ));
        await hooks.emit('onSession', client);
      }
      const isInvalid = scheme && !validator.validate(scheme, body);
      if (isInvalid || (validate && !await validate(body)))
        return void client.error(new client.Error(
          `${method} ${url} request validation failed`,
          { httpCode: 400 },
        ));
      await hooks.emit('postValidation', client);
      const result = await handler(client);
      client.send(result);
    } catch (err) {
      client.error(err);
    }
  });

  server.listen(port, host, () => console.log(
    `Server listenning at http://${host}:${port}/`
  ));

  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
      setTimeout(() => {
        console.error('Process took too long to exit. Exiting forcefully');
        process.exit(1);
      }, options.exitTimeout);
      server.close(() => {
        console.log('Server closed. Exiting process');
        process.exit(0);
      });
    });
  });
};

```

Кожен запит виконується в ізольованому контексті, що значно покращує надійність та ефективність коду. Під час виконання запиту система "хуків" дозволяє розробнику забезпечувати велику гнучкість та створювати спільні обробники-модулі для всіх ресурсів. Крім того, всі етапи в програмі можуть бути заисані в логи для подальшого аналізу роботи системи.

Написане нами системне рішення надає можливість використовувати зручний синтаксис для опису бізнес логіки, здійснювати перевірку вхідних параметрів, писати ефективний роутинг на файловій системі, реалізовує механізм сесій та автентифікації користувачів, надає необідні інструменти для реалізації простих **RESTful** сервісів:
```javascript
// app/api/auth/provider.js

'use strict';

const { framework, db, node, api } = require('framework');

framework.api({
  generateToken() {
    return node.crypto.randomUUID();
  },

  async createSession(token, data, expires) {
    const state = JSON.stringify(data);
    const record = { id: token, state };
    if (expires) {
      const date = expires.toISOString();
      Object.assign(record, { 'expires_at': date });
    }
    await db.insert('sessions', record);
  },

  async updateSession(token, data) {
    await db.pg.updateById(
      'sessions',
      token,
      { state: JSON.stringify(data) }
    );
  },

  async deleteSession(token) {
    await db.deleteById('sessions', token);
  },

  async authorize(token) {
    try {
      const session = await db.findById('sessions', token);
      return session;
    } catch (err) {
      return null;
    }
  },

  async registerUser(login, password) {
    return db.insert('users', { login, password, 'system_role': 'user' });
  },

  async getUser(login) {
    return db.findOne('users', { login }, ['id', 'login', 'password']);
  },
});

framework.addHook('onSession', async (client) => {
  const token = client.session.get('token');
  if (token) {
    const session = await api.auth.provider.authorize(token);
    if (session) {
      const exp = session.expires_at;
      if (exp && new Date(exp) < new Date()) {
        await api.auth.deleteSession(token);
        client.session.clear();
      } else {
        const { user } = JSON.parse(session.state);
        client.state.user = user;
        return;
      }
    } else {
      client.session.clear();
    }
  }
  throw new client.Error(
    'Invalid session violents access rules restrictions',
    { httpCode: 401 }
  );
});

// app/api/auth/signin.js

'use strict';

const { framework, common, api, config } = require('framework');

framework.post({
  access: 'public',
  scheme: {
    type: 'object',
    properties: {
      login: {
        type: 'string',
        minLength: 4,
        maxLength: 16,
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 32,
      },
    },
    required: ['login', 'password']
  },
  handler: async (client) => {
    const { login, password } = client.body;
    const user = await api.auth.provider.getUser(login);
    if (!user) throw new client.Error('Incorrect login or password');
    const valid = await common.validatePassword(password, user.password);
    if (!valid) throw new client.Error('Incorrect login or password');
    const token = api.auth.provider.generateToken();
    const expires = new Date(Date.now() + config.session.expires);
    await api.auth.provider.createSession(token, { user }, expires);
    client.session.set({ token }, expires.getTime());
    return { status: 'success', httpCode: 201 };
  },
});
```

## Початок роботи

### Вимоги:

- `PostgreSQL` (15v+)
- `Node.js` (18v+)
- Будь-яка оболонка для виконання скриптів мовою `Shell`

### Генерація початкової структури бази данних

```shell
chmod u+x ./sql/setup.sh

./sql/setup.sh # Потрібно вводити пароль користувача postgres
```

### Заповніть поле `DB_PASSWORD` в файлі змінних середовища `.env`

```shell
# Environment
NODE_ENV="production"

# Database
DB_USER="postgres"
DB_PASSWORD="<YOUR_PASSWORD>"
DB_DATABASE="versys"
```

### Запуск програми в режимі розробника (тільки з версіює `Node.js` 20 та більше)

```shell
npm run dev
```

### Запуск програми в `production` режимі 
 
```shell
npm start
```

## Висновок

Важливо враховувати, що вибір між чистою Node.js та використанням об'єктно-реляційного відображення (ORM) має свої плюси та мінуси. Використання чистої Node.js може надати більше гнучкості та контролю над розробкою, але при цьому вимагати більше зусиль для реалізації рутинних завдань. З іншого боку, використання ORM може полегшити взаємодію з базою даних та спростити структуру коду, але веде до втрати контролю над деякими аспектами оптимізації та може вимагати додаткового часу для навчання та конфігурації. Обирайте ту стратегію, яка краще відповідає конкретним вимогам та потребам вашого проєкту, забезпечуючи баланс між гнучкістю та продуктивністю.