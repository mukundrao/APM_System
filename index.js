const express = require("express");
const mysql = require("mysql2");
const path = require('path');
require("dotenv").config();
const app = express();
const notifier = require('node-notifier');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views')); 

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : process.env.mysql,
    database : 'apm'
});
app.use(express.urlencoded({ extended: true }))
app.get('/',(req, res) =>{
    res.sendFile(path.join(__dirname+'/index.html'));
})
app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/" + "style.css");
  });
  app.get('/views.css', function(req, res) {
   res.sendFile(__dirname + "/" + "views.css");
  });
app.get('/ourlogo.jpg', function(req, res) {
    res.sendFile(__dirname + "/" + "ourlogo.jpg");
  });
  app.get('/icon.png', function(req, res) {
    res.sendFile(__dirname + "/" + "icon.png");
  });
  app.get('/Person.jpg', function(req, res) {
    res.sendFile(__dirname + "/" + "Person.jpg");
  });
  app.get('/sindhu.jpg', function(req, res) {
    res.sendFile(__dirname + "/" + "sindhu.jpg");
  });
  app.get('/teacher.jpg', function(req, res) {
    res.sendFile(__dirname + "/" + "teacher.jpg");
  });
  app.get('/student.png', function(req, res) {
    res.sendFile(__dirname + "/" + "student.png");
  });
  app.get('/ournewlogo.png', function(req, res) {
    res.sendFile(__dirname + "/" + "ournewlogo.png");
  });
app.get('/student_login',(req, res) =>{
    res.sendFile(path.join(__dirname+'/student_login.html'));
})
app.get('/student_login2',(req, res) =>{
    res.sendFile(path.join(__dirname+'/student_login2.html'));
})
app.get('/teacher_login',(req, res) =>{
    res.sendFile(path.join(__dirname+'/teacher_login.html'));
})
app.get('/teacher_login2',(req, res) =>{
    res.sendFile(path.join(__dirname+'/teacher_login2.html'));
})
app.get('/student_main/:usn',(req,res)=>{
    console.log(req.params);
    var pk = req.params.usn;
    var r = `SELECT total FROM (SELECT usn,SUM(points) AS total FROM certificate GROUP BY usn) AS totals WHERE usn=?`;
     var q = `SELECT student.name AS sname,usn,faculty.id AS id,faculty.name AS fname,semester,section FROM student,faculty WHERE usn=? AND faculty.id=student.id`;
     connection.query(r,[pk],function(error, results, fields) {
        console.log(results);
         try{
            var total = results[0].total;
            }
            catch(TypeError)
            {
             total = 0;
            }
         connection.query(q,[pk],function(error, results, fields) {
            console.log(results);
         res.render('student_homepage.ejs',{usn : pk, sname : results[0].sname, id : results[0].id, fname : results[0].fname, points_earned : total, semester : results[0].semester, section : results[0].section});
     
        })
     })
})
     
app.post('/student_main',(req,res)=>{
   console.log(req.body);
   var pk = req.body.usn;
    var r = `SELECT total FROM (SELECT usn,SUM(points) AS total FROM certificate GROUP BY usn) AS totals WHERE usn=?`;
    connection.query(r,[pk],function(error, results, fields) {
        console.log(results);
         try{
         var total = results[0].total;
         }
         catch(TypeError)
         {
          total = 0;
         }
         var q = `SELECT student.name AS sname,usn,student.password AS password,faculty.id AS id,faculty.name AS fname,semester,section FROM student,faculty WHERE usn=? AND faculty.id=student.id`;
         connection.query(q,[pk],function(error, results, fields) {
            while(1)
            {
            console.log(results);
            if(results.length === 0)
            {
                res.render('student_loginfail.ejs');
                break;
            }
            if((pk != results[0].usn)||(req.body.password != results[0].password)){
                res.render('student_loginfail.ejs');
                break;
            }
            else{
        res.render('student_homepage.ejs',{usn : pk, sname : results[0].sname, id : results[0].id, fname : results[0].fname, points_earned : total, semester : results[0].semester, section : results[0].section});
        break;
            }
        }
    })
 
    })
    
})
app.get('/teacher_main/:id',(req,res)=>{
    console.log(req.params);
    var pk = req.params.id;
    var q = `SELECT name,id,designation FROM faculty WHERE id=?`;
    connection.query(q,[pk],function(error, results, fields) {
        console.log(results);
    res.render('teacher_homepage.ejs',{id : pk, name : results[0].name, designation : results[0].designation});   
})
})
app.post('/teacher_main',(req,res)=>{
     var pk = req.body.id;
     var q = `SELECT name,id,password,designation FROM faculty WHERE id=?`;
     connection.query(q,[pk],function(error, results, fields) {
         while(1)
         {
         console.log(results);
         if(results.length === 0)
         {
             res.render('teacher_loginfail.ejs');
             break;
         }
         if((pk != results[0].id)||(req.body.password != results[0].password)){
             res.render('teacher_loginfail.ejs');
             break;
         }
         else{
     res.render('teacher_homepage.ejs',{id : pk, name : results[0].name, designation : results[0].designation});
     break;
         }
     }  
 })
 })
 app.get('/s_certificates/:usn',(req, res) =>{
    var pk = req.params.usn;
    var q = `SELECT code,faculty.id AS fid,faculty.name AS fname,certificate.name AS cname,link,status,points,category,time FROM certificate,faculty WHERE usn=? AND certificate.id=faculty.id ORDER BY code DESC`;
    connection.query(q,[pk],function(error, results, fields){
        console.log(results);
        res.render("s_certificates",{results : results, usn : pk})
    })
})
app.get('/s_accepted/:usn',(req, res) =>{
    var pk = req.params.usn;
    var q = `SELECT code,faculty.id AS fid,faculty.name AS fname,certificate.name AS cname,link,status,points,category,time FROM certificate,faculty WHERE usn=? AND certificate.id=faculty.id AND status=1 ORDER BY code DESC`;
    connection.query(q,[pk],function(error, results, fields){
        res.render("s_certificates",{results : results, usn : pk})
    })
})
app.get('/s_pending/:usn',(req, res) =>{
    var pk = req.params.usn;
    var q = `SELECT code,faculty.id AS fid,faculty.name AS fname,certificate.name AS cname,link,status,points,category,time FROM certificate,faculty WHERE usn=? AND certificate.id=faculty.id AND status IS NULL ORDER BY code DESC`;
    connection.query(q,[pk],function(error, results, fields){
        res.render("s_certificates",{results : results, usn : pk})
    })
})
app.get('/s_rejected/:usn',(req, res) =>{
    var pk = req.params.usn;
    var q = `SELECT code,faculty.id AS fid,faculty.name AS fname,certificate.name AS cname,link,status,points,category,time FROM certificate,faculty WHERE usn=? AND certificate.id=faculty.id AND status=0 ORDER BY code DESC`;
    connection.query(q,[pk],function(error, results, fields){
        res.render("s_certificates",{results : results, usn : pk})
    })
})
app.get('/t_certificates/:id',(req, res) =>{
    var pk = req.params.id;
    var q = `SELECT code,student.usn AS usn,student.name AS sname,certificate.name AS cname,link,status,points,category,time FROM certificate,student WHERE certificate.id=? AND certificate.usn=student.usn`;
    connection.query(q,[pk],function(error, results, fields){
        console.log(results);
        res.render("t_certificates",{results : results, id : pk})
    })
})
app.get('/t_accepted/:id',(req, res) =>{
    var pk = req.params.id;
    var q = `SELECT code,student.usn AS usn,student.name AS sname,certificate.name AS cname,link,status,points,category,time FROM certificate,student WHERE certificate.id=? AND certificate.usn=student.usn AND status=1 ORDER BY code DESC`;
    connection.query(q,[pk],function(error, results, fields){
        console.log(results);
        res.render("t_certificates",{results : results, id : pk})
    })
})
app.get('/t_rejected/:id',(req, res) =>{
    var pk = req.params.id;
    var q = `SELECT code,student.usn AS usn,student.name AS sname,certificate.name AS cname,link,status,points,category,time FROM certificate,student WHERE certificate.id=? AND certificate.usn=student.usn AND status=0 ORDER BY code DESC`;
    connection.query(q,[pk],function(error, results, fields){
        console.log(results);
        res.render("t_certificates",{results : results, id : pk})
    })
})
app.get('/t_pending/:id',(req, res) =>{
    var pk = req.params.id;
    var q = `SELECT code,student.usn AS usn,student.name AS sname,certificate.name AS cname,link,status,points,category,time FROM certificate,student WHERE certificate.id=? AND certificate.usn=student.usn AND status IS NULL`;
    connection.query(q,[pk],function(error, results, fields){
        console.log(results);
        res.render("t_pending",{results : results, id : pk})
    })
})
app.post('/t_action/:id/:code',(req, res) =>{
    var pk1 = req.params.id;
    var pk2 = req.params.code;
    if(req.body.action == 0)
    {
        var q = "UPDATE certificate SET status=0,points=0,category='None' WHERE id=? AND code=?";
        connection.query(q,[pk1,pk2],function(error, results, fields){
            res.redirect(`/t_rejected/${pk1}/${pk2}`);
        })
        
    }
    else{
        res.render('t_accept',{id : pk1, code : pk2});
    }
})
app.post('/t_r/:id/:code',(req, res) =>{
    var pk1 = req.params.id;
    var pk2 = req.params.code;
        var q = "UPDATE certificate SET status=0,points=0,category='None' WHERE id=? AND code=?";
        connection.query(q,[pk1,pk2],function(error, results, fields){
            res.redirect(`/t_rejected/${pk1}/${pk2}`);
        })       
})
app.post('/t_a/:id/:code',(req, res) =>{
    var pk1 = req.params.id;
    var pk2 = req.params.code;
    res.render('t_accept',{id : pk1, code : pk2});
})
app.post('/t_accept/:id/:code',(req, res) =>{
    var pk1 = req.params.id;
    var pk2 = req.params.code;
    var a = req.body.points;
    var b = req.body.header;
        var q = 'UPDATE certificate SET status=1,points=?,category=? WHERE id=? AND code=?';
        connection.query(q,[a,b,pk1,pk2],function(error, results, fields){
            res.redirect(`/t_accepted/${pk1}/${pk2}`);
        })
        
})
app.get('/t_accepted/:id/:code',(req, res) =>{
    res.render('t_accepted',{code : req.params.code, id : req.params.id});
})
app.get('/t_rejected/:id/:code',(req, res) =>{
    res.render('t_rejected',{code : req.params.code, id : req.params.id});
})
app.get('/s_changepwd/:usn',(req, res) =>{
    res.render('s_changepwd',{usn : req.params.usn});
})
app.get('/t_changepwd/:id',(req, res) =>{
    res.render('t_changepwd',{id : req.params.id});
})
app.get('/t_modify/:id',(req, res) =>{
    res.render('t_modify',{id : req.params.id});
})
app.post('/t_modified/:id',(req, res) =>{
    var pk1 = req.params.id;
    var pk2 = req.body.code;
    var q = `SELECT code,student.usn AS usn,student.name AS sname,certificate.name AS cname,link,status,points,category,time FROM certificate,student WHERE certificate.id=? AND certificate.usn=student.usn AND status IN (0,1) AND code=?`;
    connection.query(q,[pk1,pk2],function(error, results, fields){
        console.log(results);
        if(results.length === 0)
        {
            res.render('t_modifyfail',{id : req.params.id});
        }
        else{
            res.render('t_modifys',{result : results[0], id : req.params.id});
        }
    })
})
app.post('/s_changed/:usn',(req, res) =>{
    var pk = req.params.usn;
    var q = "SELECT password FROM student WHERE usn=?";
    connection.query(q,[pk],function(error, results, fields){
        while(1)
        {
            if((req.body.oldpwd === results[0].password)&&(req.body.oldpwd === req.body.newpwd))
        {
            res.render('s_failduplicate',{usn : req.params.usn});
            break;
        }
        else if((req.body.oldpwd === results[0].password)&&(req.body.newpwd === req.body.cnewpwd))
        {
           var pk2 = req.body.newpwd;
           var r = "UPDATE student SET password=? WHERE usn=?";
           connection.query(r,[pk2,pk],function(error, results, fields){
           res.redirect(`/student_login2`)
        })
        break;
        }
        else if(req.body.oldpwd !== results[0].password)
        {
            res.render('s_failold',{usn : req.params.usn});
            break;
        }
        
        else{
            res.render('s_failnew',{usn : req.params.usn});
            break;
        }
    }
    })
})
app.post('/t_changed/:id',(req, res) =>{
    var pk = req.params.id;
    var q = "SELECT password FROM faculty WHERE id=?";
    connection.query(q,[pk],function(error, results, fields){
        while(1)
        {
            if((req.body.oldpwd === results[0].password)&&(req.body.oldpwd === req.body.newpwd))
        {
            res.render('t_failduplicate',{id : req.params.id});
            break;
        }
        else if((req.body.oldpwd === results[0].password)&&(req.body.newpwd === req.body.cnewpwd))
        {
           var pk2 = req.body.newpwd;
           var r = "UPDATE faculty SET password=? WHERE id=?";
           connection.query(r,[pk2,pk],function(error, results, fields){
           res.redirect(`/teacher_login2`)
        })
        break;
        }
        else if(req.body.oldpwd !== results[0].password)
        {
            res.render('t_failold',{id : req.params.id});
            break;
        }
        else{
            res.render('t_failnew',{id : req.params.id});
            break;
        }
    }
    })
})
app.get('/s_upload/:usn/:id',(req, res) =>{
    console.log(req.params);
    res.render("s_upload",{usn : req.params.usn, id : req.params.id});
})
app.get('/s_delete/:usn',(req, res) =>{
    console.log(req.params);
    res.render("s_delete",{usn : req.params.usn});
})
app.get('/s_sd/:usn/:code',(req, res) =>{
    res.render("s_sd",{usn : req.params.usn, code : req.params.code});
})
app.post('/s_deleted/:usn',(req, res) =>{
    var pk2 = req.params.usn;
    var pk1 = req.body.code;
    var q = `DELETE FROM certificate WHERE code=? AND usn=? AND (status=0 OR status IS NULL)`;
    connection.query(q,[pk1,pk2],function(error,results,fields){
        console.log(results)
        while(1){
        if(results.affectedRows === 1)
        {
        res.redirect(`/s_sd/${pk2}/${pk1}`);
        break;
        }
        else
        {
            res.render("s_deletefail",{usn : pk2});
            break;
        }
        }
    })
})
app.get('/s_su/:usn/:name/:link/:code',(req, res) =>{
    res.render('s_su',{usn : req.params.usn, name : req.params.name, link : req.params.link, code : req.params.code})
})
app.post('/s_uploaded/:usn/:id',(req, res) =>{
    var pk1 = req.params.usn;
    var pk2 = req.params.id;
    var a = req.body.name;
    var b = req.body.url;
    var s = `SELECT * FROM certificate WHERE link=?`;
    //var r = `SELECT code FROM certificate WHERE link=?`;     
    connection.query(s,[b],function(error,results,fields){
        while(1)
        {
            if(results.length !== 0)
            {
                res.render('s_duplicate',{usn : pk1, id : pk2});
                break;
            }
            else{
                var c = encodeURIComponent(req.body.url);
    console.log(pk1,pk2,a,b);
    var q = `INSERT INTO certificate (usn,id,name,link,time) VALUES (?,?,?,?,NOW())`;
    connection.query(q,[pk1,pk2,a,b],function(error,results,fields){
        console.log(results);
    })
    var r = `SELECT code FROM certificate WHERE link=?`;     
    connection.query(r,[b],function(error,results,fields){
        res.redirect(`/s_su/${pk1}/${a}/${c}/${results[0].code}`)
    })
    break;
            }
        }
    })
    
})
app.get('/s_su/:usn/:name/:link/:code',(req, res) =>{
    res.render('s_su',{usn : req.params.usn, name : req.params.name, link : req.params.link, code : req.params.code})
})
app.get('/logout',(req, res) =>{
    res.render("logout");
})
app.get('/hello',(req, res) =>{
    res.render('h');
})
app.get('*',(req, res) =>{
    res.send("PATH UNKNOWN")
})
app.listen(3000, () => {
    console.log("Listening on port 3000");
})