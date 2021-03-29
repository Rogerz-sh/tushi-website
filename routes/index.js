var express = require('express');
var router = express.Router();
const moment = require('moment')

const Article = require('../model/article');
const Example = require('../model/example');

/* GET home page. */
router.get('/', async function (req, res, next) {
    let news_list = [], example_list = [];
    try {
        let articles = await Article.find({ is_deleted: 0 }).sort({ publish_date: -1 }).limit(6).exec();
        articles.forEach(art => {
            news_list.push({
                cover: art.cover,
                title: art.title,
                content: art.subtitle,
                link: '/news-detail?id=' + art._id
            })
        })
        let examples = await Example.find({ is_deleted: 0 }).sort({ publish_date: -1 }).limit(3).exec();
        examples.forEach(exp => {
            example_list.push({
                cover: exp.cover,
                title: exp.title
            })
        })
    } catch (error) {

    }
    res.render('index', {
        title: '图莳数字-首页',
        layout: 'layouts/layout',
        news_list: news_list,
        example_list: example_list
    });
});

/* about us */
router.get('/about', (req, res) => {
    res.render('about', {
        title: '图莳数字-图莳简介',
        layout: 'layouts/layout'
    });
})
router.get('/team', (req, res) => {
    res.render('team', {
        title: '图莳数字-管理团队',
        layout: 'layouts/layout'
    });
})
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: '图莳数字-联系我们',
        layout: 'layouts/layout'
    });
})
router.get('/join', (req, res) => {
    res.render('join', {
        title: '图莳数字-加入我们',
        layout: 'layouts/layout'
    });
})

/* news */
router.get('/news', async (req, res, next) => {
    let news_list = [];
    try {
        let articles = await Article.find({ is_deleted: 0 }).sort({ publish_date: -1 }).exec();
        articles.forEach(art => {
            news_list.push({
                cover: art.cover,
                title: art.title,
                content: art.subtitle.substr(0, 70),
                publish_date: moment(art.publish_date).format('YYYY-MM-DD'),
                link: '/news-detail?id=' + art._id
            })
        })
    } catch (error) {

    }
    res.render('news', {
        title: '图莳数字-新闻',
        layout: 'layouts/layout',
        news_list: news_list
    })
})
router.get('/news-detail', async (req, res, next) => {
    let id = req.query.id, data = {
        cover: "",
        title: "",
        content: "",
        publish_date: ""
    };
    try {
        let art = await Article.findById(id).exec();
        if (art) {
            data = {
                cover: art.cover,
                title: art.title,
                subtitle: art.subtitle,
                content: art.content,
                publish_date: moment(art.publish_date).format('YYYY-MM-DD')
            }
        }
    } catch (error) {

    }
    res.render('news-detail', {
        title: '图莳数字-新闻',
        layout: 'layouts/layout',
        news_detail: data
    })
})

/* partner */
router.get('/partner', (req, res) => {
    res.render('partner', {
        title: '图莳数字-合作伙伴',
        layout: 'layouts/layout'
    });
})

/* example */
router.get('/examples', async (req, res) => {
    let example_list = [], type = req.query.type;
    try {
        let examples = await Example.find({ is_deleted: 0, type }).sort({ publish_date: -1 }).exec();
        examples.forEach(exp => {
            example_list.push({
                cover: exp.cover,
                title: exp.title
            })
        })
    } catch (error) {

    }
    res.render('examples', {
        title: '图莳数字-行业案例',
        layout: 'layouts/layout',
        example_list: example_list
    });
})

/* production */
router.get('/dsp', (req, res) => {
    res.render('dsp', {
        title: '图莳数字-DSP程序化营销平台',
        layout: 'layouts/layout'
    });
})
router.get('/otv', (req, res) => {
    res.render('otv', {
        title: '图莳数字-OTV视频营销平台',
        layout: 'layouts/layout'
    });
})
router.get('/ott', (req, res) => {
    res.render('ott', {
        title: '图莳数字-OTT智能电视营销平台',
        layout: 'layouts/layout'
    });
})
router.get('/adx', (req, res) => {
    res.render('adx', {
        title: '图莳数字-ADX广告交易平台',
        layout: 'layouts/layout'
    });
})
router.get('/private', (req, res) => {
    res.render('private', {
        title: '图莳数字-隐私政策',
        layout: 'layouts/layout'
    });
})

module.exports = router;
