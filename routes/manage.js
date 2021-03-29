const express = require('express');
const router = express.Router();
const tool = require('../utils/tool');
const auth = require('../utils/auth');
const formidable = require('formidable');
const path = require('path');

const Account = require('../model/account')
const Article = require('../model/article')
const Example = require('../model/example')
const Picture = require('../model/picture')

/* GET users listing. */
router.get('/_?(login)?', function (req, res, next) {
  res.render('manage/login', {
    title: '图莳数字-后台管理登陆',
    layout: null
  })
});

router.post('/user-login', async (req, res) => {
  try {
    let username = req.body.username, password = req.body.password;
    if (!username || !password) {
      tool.errorHandler(res, 'username or password is empty');
      return;
    }
    let user = await Account.findOne({ username: username, is_deleted: 0, status: 1 }).exec();
    if (!user) {
      tool.errorHandler(res, 'username is not exists');
      return;
    }
    if (user.password !== password && user.password !== tool.md5(password)) {
      tool.errorHandler(res, 'password is not correct');
      return;
    }
    req.session.account = user.toJSON();
    tool.successHandler(res, '/manage/news');
  } catch (err) {
    tool.errorHandler(res, err);
  }
})

router.use(auth.checkLogin);

router.get('/news', (req, res) => {
  res.render('manage/news', {
    title: '图莳数字-新闻管理',
    layout: 'layouts/manage'
  })
})

router.get('/news-modify', (req, res) => {
  res.render('manage/news-modify', {
    title: '图莳数字-新闻管理',
    layout: 'layouts/manage'
  })
})

router.get('/example', (req, res) => {
  res.render('manage/example', {
    title: '图莳数字-案例管理',
    layout: 'layouts/manage'
  })
})

router.get('/example-modify', (req, res) => {
  res.render('manage/example-modify', {
    title: '图莳数字-案例管理',
    layout: 'layouts/manage'
  })
})

router.get('/pictures', (req, res) => {
  res.render('manage/pictures', {
    title: '图莳数字-图片管理',
    layout: 'layouts/manage'
  })
})

router.get('/json-news-list', async (req, res) => {
  try {
    let query = req.query.query || {}, limit = +req.query.take || 10, skip = +req.query.skip, where = { is_deleted: 0 };
    if (query.title) {
      where['title'] = new RegExp(query.title, 'g');
    }
    if (query.sdate) {
      if (!where['publish_date']) where['publish_date'] = {}
      where['publish_date']['$gte'] = new Date(query.sdate + ' 00:00:00').getTime();
    }
    if (query.edate) {
      if (!where['publish_date']) where['publish_date'] = {}
      where['publish_date']['$lte'] = new Date(query.edate + ' 23:59:59').getTime();
    }
    let news_list = await Article.find(where).skip(skip).limit(limit).sort({ created_at: -1 }).exec();
    let count = await Article.count(where).exec();
    tool.successHandler(res, { 'total': count, 'result': news_list })
  } catch (err) {
    tool.errorHandler(res, err);
  }
})

router.get('/json-news-detail', async (req, res) => {
  try {
    let id = req.query.id;
    let article = await Article.findOne({ _id: id, is_deleted: 0 }).exec();
    if (article) {
      tool.successHandler(res, article);
    } else {
      tool.errorHandler(res, 'article is no exists');
    }
  } catch (err) {
    tool.errorHandler(res, err);
  }
})

router.post('/save-article', async (req, res) => {
  try {
    let id = req.body.id, article = JSON.parse(unescape(req.body.article));
    if (id) {
      await Article.findByIdAndUpdate(id, { $set: article }).exec();
    } else {
      let newObj = new Article(article);
      await newObj.save();
    }
    tool.successHandler(res, 'success');
  } catch (err) {
    tool.errorHandler(res, err);
  }
})

router.get('/json-example-list', async (req, res) => {
    try {
      let query = req.query.query || {}, limit = +req.query.take || 10, skip = +req.query.skip, where = { is_deleted: 0 };
      if (query.title) {
        where['title'] = new RegExp(query.title, 'g');
      }
      if (query.sdate) {
        if (!where['publish_date']) where['publish_date'] = {}
        where['publish_date']['$gte'] = new Date(query.sdate + ' 00:00:00').getTime();
      }
      if (query.edate) {
        if (!where['publish_date']) where['publish_date'] = {}
        where['publish_date']['$lte'] = new Date(query.edate + ' 23:59:59').getTime();
      }
      let examples = await Example.find(where).skip(skip).limit(limit).sort({ created_at: -1 }).exec();
      let count = await Example.count(where).exec();
      tool.successHandler(res, { 'total': count, 'result': examples })
    } catch (err) {
      tool.errorHandler(res, err);
    }
  })
  
  router.get('/json-example-detail', async (req, res) => {
    try {
      let id = req.query.id;
      let example = await Example.findOne({ _id: id, is_deleted: 0 }).exec();
      if (example) {
        tool.successHandler(res, example);
      } else {
        tool.errorHandler(res, 'example is no exists');
      }
    } catch (err) {
      tool.errorHandler(res, err);
    }
  })
  
  router.post('/save-example', async (req, res) => {
    try {
      let id = req.body.id, example = JSON.parse(unescape(req.body.example));
      if (id) {
        await Example.findByIdAndUpdate(id, { $set: example }).exec();
      } else {
        let newObj = new Example(example);
        await newObj.save();
      }
      tool.successHandler(res, 'success');
    } catch (err) {
      tool.errorHandler(res, err);
    }
  })
  

router.get('/json-picture-list', async (req, res) => {
  try {
    let query = req.query.query || {}, limit = +req.query.take || 10, skip = +req.query.skip, where = { is_deleted: 0 };
    if (query.sdate) {
      if (!where['created_at']) where['created_at'] = {}
      where['created_at']['$gte'] = query.sdate + ' 00:00:00';
    }
    if (query.edate) {
      if (!where['created_at']) where['created_at'] = {}
      where['created_at']['$lte'] = query.edate + ' 23:59:59';
    }
    let pictures = await Picture.find(where).skip(skip).limit(limit).sort({ created_at: -1 }).exec();
    let count = await Picture.count(where).exec();
    tool.successHandler(res, { 'total': count, 'result': pictures })
  } catch (err) {
    tool.errorHandler(res, err);
  }
})

router.post('/save-picture', async (req, res) => {
  try {
    let pic = JSON.parse(unescape(req.body.pic));
    if (pic.filename && pic.filepath) {
      let newObj = new Picture(pic);
      await newObj.save();
      tool.successHandler(res, 'success');
    } else {
      tool.errorHandler(res, 'picture info invaild');
    }
  } catch (err) {
    tool.errorHandler(res, err);
  }
})

router.post('/remove-picture', async (req, res) => {
  try {
    let id = req.body.id;
    await Picture.findByIdAndUpdate(id, { $set: { is_deleted: 1 } }).exec();
    tool.successHandler(res, 'success');
  } catch (err) {
    tool.errorHandler(res, err);
  }
})

router.post('/upload-file', (req, res) => {
  let form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = path.join(__dirname + "/../public/upload");
  form.keepExtensions = true;//保留后缀
  form.parse(req, function (err, fields, files) {
    if (!files) tool.errorHandler(res, err);
    let path = files.file.path.split('public')[1];
    tool.successHandler(res, path);
  });
});

router.post('/edit-user-password', async (req, res) => {
  try {
      let user = req.session.account, password_old = unescape(req.body.password_old), password_new = unescape(req.body.password_new);
      let account = await Account.findById(user._id).exec();
      if (account.password === password_old || account.password == tool.md5(password_old)) {
          account.password = tool.md5(password_new);
          await account.save();
          tool.successHandler(res, 1);
      } else {
          tool.errorHandler(res, '原密码不正确');
      }
  } catch (err) {
      tool.errorHandler(res, '操作失败');
  }
})

router.get('/user-logout', function (req, res) {
  req.session.destroy();
  res.redirect('/manage/login');
});

module.exports = router;
