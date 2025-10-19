require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const logger = require('koa-logger');
const knex = require('./database');

const app = new Koa();
const router = new Router();

// Middleware
app.use(logger());
app.use(cors());
app.use(bodyParser());

// Routes
router.get('/', async (ctx) => {
  ctx.body = { 
    message: 'Mobile Boilerplate API', 
    version: '1.0.0',
    status: 'running' 
  };
});

router.get('/health', async (ctx) => {
  try {
    await knex.raw('SELECT 1');
    ctx.body = { status: 'healthy', database: 'connected' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: 'unhealthy', database: 'disconnected', error: error.message };
  }
});

// GET /users - Liste des utilisateurs avec recherche et pagination
router.get('/users', async (ctx) => {
  try {
    const { search, page = 1, limit = 10 } = ctx.query;
    let query = knex('users');
    
    // Recherche par nom ou email
    if (search) {
      query = query.where(function() {
        this.where('name', 'ilike', `%${search}%`)
            .orWhere('email', 'ilike', `%${search}%`);
      });
    }
    
    // Pagination
    const offset = (page - 1) * limit;
    const users = await query
      .select('*')
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');
    
    // Compter le total pour la pagination
    const totalQuery = knex('users');
    if (search) {
      totalQuery.where(function() {
        this.where('name', 'ilike', `%${search}%`)
            .orWhere('email', 'ilike', `%${search}%`);
      });
    }
    const [{ count }] = await totalQuery.count('* as count');
    
    ctx.body = {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(count),
        totalPages: Math.ceil(count / limit)
      }
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

router.post('/users', async (ctx) => {
  try {
    const { name, email } = ctx.request.body;
    
    // Validation simple
    if (!name || !email) {
      ctx.status = 400;
      ctx.body = { error: 'Name and email are required' };
      return;
    }
    
    const [user] = await knex('users').insert({ name, email }).returning('*');
    ctx.status = 201;
    ctx.body = user;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// GET /users/:id - Récupérer un utilisateur par ID
router.get('/users/:id', async (ctx) => {
  try {
    const { id } = ctx.params;
    const user = await knex('users').where('id', id).first();
    
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }
    
    ctx.body = user;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// PUT /users/:id - Modifier un utilisateur
router.put('/users/:id', async (ctx) => {
  try {
    const { id } = ctx.params;
    const { name, email } = ctx.request.body;
    
    // Vérifier que l'utilisateur existe
    const existingUser = await knex('users').where('id', id).first();
    if (!existingUser) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }
    
    // Mise à jour
    const [updatedUser] = await knex('users')
      .where('id', id)
      .update({ 
        name: name || existingUser.name,
        email: email || existingUser.email,
        updated_at: knex.fn.now()
      })
      .returning('*');
    
    ctx.body = updatedUser;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

// DELETE /users/:id - Supprimer un utilisateur
router.delete('/users/:id', async (ctx) => {
  try {
    const { id } = ctx.params;
    
    const deletedCount = await knex('users').where('id', id).del();
    
    if (deletedCount === 0) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }
    
    ctx.status = 204; // No Content
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});


app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});