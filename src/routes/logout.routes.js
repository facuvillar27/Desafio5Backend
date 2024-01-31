import {Router} from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.render('login', {
        title: 'Inicia sesión',
    })
})

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/login');
        }
        res.clearCookie('sid');
        res.redirect('/login');
    });
});

export default router;