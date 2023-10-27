const express = require('express');
const router = express.Router();
const fs = require('fs');


function readDataFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอ่านไฟล์:', error);
      return [];
    }
}

function writeDataFile(filePath,data) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเขียนไฟล์:', error);
    }
}  




router.get('/',(req,res)=>{
    res.status(200).json({ message: 'ยินดีต้อนรับสู่ Mockup APIs เว็บไซต์แสดงสินค้า ' });
})

//ล็อคอิน
router.post('/login',(req,res)=>{
    
    const username =req.body.username
    const password =req.body.password
    const time= 30000000 // 30 วิ
    const userdb = readDataFile('userdb.json')

    const login = userdb.filter(item => item.username === username && item.password === password)
    if(login.length!=0){
        req.session.username = username
        req.session.password = password
        req.session.login= true
        req.session.cookie.maxAge = time
        res.json({ result: "ล็อคอินสำเร็จ", login })
    }
    else{
        res.json({ result: "ล็อคอินไม่สำเร็จ" })
    }
    
})
//เพิ่มข้อมูลสมาชิก
router.post('/adduser',(req,res)=>{

    const data = readDataFile('userdb.json')
    const user_id =Math.max(...data.map(item => item.user_id));
    const username =req.body.username
    const name =req.body.name
    const position =req.body.position
    const password =req.body.password
    if(req.session.login){
        if(username!= undefined && name != undefined && position!= undefined && password!= undefined ){
            const adduser = {
              user_id: user_id + 1,
              username:username,
              name:name,
              position: position,
              password:password, 
            };
            data.push(adduser)
            writeDataFile('userdb.json',data);
            res.json({ message: 'เพิ่มข้อมูลสมาชิกสำเร็จ', Result: adduser})
        }else{
            res.json({ message: 'กรุณากรอกข้อมูลให้ครบ'})
        }
    }else{
        res.json({ message: 'กรุณาล็อคอินก่อน'})
    }
          
})


//แสดงข้อมูลสมาชิกทั้งหมด
router.get('/user',(req,res)=>{

    const data = readDataFile('userdb.json')
    if(req.session.login){
        res.json({ result: data })
    }else{
        res.json({ message: 'กรุณาล็อคอินก่อน'})
    }
          
})

//แสดงข้อมูลสินค้าทั้งหมด
router.get('/product',(req,res)=>{

    const data = readDataFile('productdb.json')
    if(req.session.login){
        res.json({ result: data })
    }else{
        res.json({ message: 'กรุณาล็อคอินก่อน'})
    }
          
})

//เพิ่มข้อมูลสินค้า
router.post('/addproduct',(req,res)=>{   
    if(req.session.login){
        const data = readDataFile('productdb.json')
        const product_id =Math.max(...data.map(item => item.product_id));
        const product_name =req.body.product_name
        const product_price = parseInt(req.body.product_price)
        const product_detail =req.body.product_detail
        if(product_id!= undefined && product_name != undefined && product_price!= undefined && product_detail!= undefined ){
            const addproduct = {
              product_id: product_id + 1,
              product_name:product_name,
              product_price:product_price,
              product_detail: product_detail
            };
            data.push(addproduct)
            writeDataFile('productdb.json',data)
            res.json({ message: 'เพิ่มข้อมูลสินค้าสำเร็จ', Result: addproduct})
        }else{
            res.json({ message: 'กรุณากรอกข้อมูลให้ครบ'})
        }
    }else{
        res.json({ message: 'กรุณาล็อคอินก่อน'})
    }
          
})

//แก้ไขข้อมูลสินค้า
router.put('/editproduct/:id',(req,res)=>{
 
    if(req.session.login){
        const data = readDataFile('productdb.json')
        const product_id = parseInt(req.params.id);
        const indexproduct_id= data.findIndex(item => item.product_id === product_id);
        if(indexproduct_id!= -1){
            data[indexproduct_id].product_name = (req.body.product_name!= undefined ? req.body.product_name:data[indexproduct_id].product_name);
            data[indexproduct_id].product_price = (req.body.product_price!= undefined ? req.body.product_price: parseInt(data[indexproduct_id].product_price));
            data[indexproduct_id].product_detail = (req.body.product_detail!= undefined ? req.body.product_detail:data[indexbook].product_detail);
            writeDataFile('productdb.json',data)
            res.json({ message: 'แก้ไขข้อมูลสินค้าสำเร็จ', Result: data[indexproduct_id]})        
          }else{
            res.json('หาข้อมูลไม่เจอ')
          }
    }else{
        res.json({ message: 'กรุณาล็อคอินก่อน'})
    }        
})
//ลบข้อมูลสินค้า
router.delete('/deleteproduct/:id',(req,res)=>{
 
    if(req.session.login){
        const data = readDataFile('productdb.json')
        const product_id = parseInt(req.params.id);
        const indexproduct_id= data.findIndex(item => item.product_id === product_id);
        if(indexproduct_id!= -1){
            data.splice(indexproduct_id, 1);
            writeDataFile('productdb.json',data)
            res.json({ message: 'ลบข้อมูลสินค้าสำเร็จ', Result: data[indexproduct_id]})        
          }else{
            res.json('หาข้อมูลไม่เจอ')
          }
    }else{
        res.json({ message: 'กรุณาล็อคอินก่อน'})
    }        
})

//แสดงข้อมูลรีวิวทั้งหมด
router.get('/review',(req,res)=>{

    const data = readDataFile('reviewdb.json')
    if(req.session.login){
        res.json({ result: data })
    }else{
        res.json({ message: 'กรุณาล็อคอินก่อน'})
    }
          
})

//เพิ่มข้อมูลรีวิวทั้งหมด
router.post('/addreview',(req,res)=>{

    if(req.session.login){
        const data = readDataFile('reviewdb.json')
        const userdata = readDataFile('userdb.json')
        const review_id =Math.max(...data.map(item => item.review_id));
        const userindex =  userdata.findIndex(item => item.username === req.session.username) 
        const user_id = userdata[userindex].user_id
        const product_id = parseInt(req.body.product_id)
        const review_rating = parseInt(req.body.review_rating)
        const review_detail =req.body.review_detail
        if(review_id!= undefined && user_id != undefined && product_id != undefined && review_rating != undefined && review_detail != undefined){
            const addreview = {
                review_id: review_id + 1,
                user_id:user_id,
                product_id:product_id,
                review_rating: review_rating,
                review_detail:review_detail
              };
            data.push(addreview)
            writeDataFile('reviewdb.json',data)
            res.json({ message: "เพิ่มรีวิวสำเร็จ",result: addreview })
        }else{
            res.json({ message: 'กรุณากรอกข้อมูลให้ครบ'})
        }
        
    }else{
        res.json({ message: 'กรุณาล็อคอินก่อน'})
    }
          
})


//แสดงข้อมูลรีวิวตามสินค้าทั้งหมด
router.get('/userreview/',(req,res)=>{
    if(req.session.login){
        const data = readDataFile('reviewdb.json')
        const userdata = readDataFile('userdb.json')
        const userindex =  userdata.findIndex(item => item.username === req.session.username) 
        const user_id = userdata[userindex].user_id
        const userreviews= data.filter(item => item.user_id === user_id) 
        res.json({ username:req.session.username ,result: userreviews })   
    }else{
        res.json({ message: 'กรุณาล็อคอินก่อน'})
    }
    
})
//แสดงข้อมูลรีวิวที่ผู้ใช้รีวิว
router.get('/productreview/:id',(req,res)=>{
    const data = readDataFile('reviewdb.json')
    const productdata = readDataFile('productdb.json')
    const product_id =  parseInt(req.params.id) 
    const productreviews= productdata.filter(item => item.product_id === product_id) 
    const reviews= data.filter(item => item.product_id === product_id) 
    const product = {
        "product_id": productreviews[0].product_id,
        "product_name": productreviews[0].product_name,
        "product_price": productreviews[0].product_price,
        "product_detail": productreviews[0].product_detail,
        "review":[reviews]
      };
      res.json({ result: product })   
})

router.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.json({ result: "ออกจากระบบ" })   
    })
   
})
module.exports = router;