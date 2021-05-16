module.exports = {
  getIndex: (req,res) => {
    if (req.user) {
      return res.redirect('/dashboard')
    }
    const locals = {
      title: 'Home',
      layout: '../views/layouts/main.ejs'
    }
    res.render('main.ejs',locals)
  },
  getDashboard: (req, res) => {
    const locals = {
      title: 'Dashboard',
      layout: '../views/layouts/dashboard.ejs',
      user: req.user
    }
    res.render('dashboard.ejs', locals)
  }
}