const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const fs = require('fs-extra')
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {
    viewSignIn : (req,res) => {
        try {
            // cari category dari database
            // const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus}
            res.render('index', {
                alert,
                title : 'Staycation | Sign In'
            });
        } catch (error) {
            res.redirect('/admin/signin');
        }
    },
    actionSignIn : async (req,res) => {
        try {
            const {username, password} = req.body;
            console.log(username, password);
            const user = await User.findOne({username : username});
            console.log(user);
            if (!user) {
                req.flash('alertMessage', 'User Not Found');
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/signin');
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                req.flash('alertMessage', 'Password Not Found');
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/signin');
            }
            req.session.user = {
                id : user.id,
                username : user.username
            }
            res.redirect('/admin/dashboard');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/signin');
        }

    },
    actionLogOut : (req,res)=> {
        req.session.destroy();
        res.redirect('/admin/signin');
    },
    viewDashboard : async (req,res) => {
        try {
            const member = await Member.find()
            const booking = await Booking.find()
            const item = await Item.find()
            res.render('admin/dashboard/view_dashboard', {
                title : 'Staycation | Dashboard',
                user : req.session.user,
                member,
                booking,
                item
            });
        } catch (error) {
            res.redirect('/admin/dashboard');
            
        }
    },
    viewCategory : async (req,res) => {
        try {
            // cari category dari database
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus}
            // console.log(category);
            // render category
            res.render('admin/category/view_category', {
                category,
                alert,
                title : 'Staycation | Category',
                user : req.session.user
            });
        } catch (error) {
            res.redirect('/admin/category');
        }  
    },
    addCategory : async (req,res) => {
        try {
            const {name} = req.body;
            // console.log('ADDCATEGORY = ' + name);
            await Category.create({name});
            req.flash('alertMessage', 'Success Add Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },
    editCategory : async (req, res) => {
        try {
            const {id, name} = req.body;
            // console.log('EDITCATEGORY - ID = ' + id);
            const category = await Category.findOne({_id : id});
            // console.log('EDITCATEGORY - CATEGORY = ' + category);
            category.name = name;
            await category.save();
            req.flash('alertMessage', 'Success Update Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },
    deleteCategory : async (req,res) => {
        try {
            const {id} = req.params;
            const category = await Category.findOne({_id : id});
            await category.remove();
            req.flash('alertMessage', 'Success Delete Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },
    viewBank : async (req,res) => {
        try {
            // cari cbank dari database
            const bank = await Bank.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus}
            // console.log(bank);
            // render bank
            res.render('admin/bank/view_bank', {
                bank,
                alert,
                title : 'Staycation | Bank',
                user : req.session.user
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    addBank : async (req,res) => {
        try {
            const {name, nameBank, nomorRekening} = req.body;
            console.log('ADDBANK = ' + req.file);
            await Bank.create({
                name,
                nameBank,
                nomorRekening,
                imageUrl: `images/${req.file.filename}`
            });
            req.flash('alertMessage', 'Success Add Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    editBank : async (req, res) => {
        try {
            const {id, name, nameBank, nomorRekening} = req.body;
            // console.log('EDITCATEGORY - ID = ' + id);
            const bank = await Bank.findOne({_id : id});
            // console.log('EDITCATEGORY - CATEGORY = ' + category);
            if (req.file == undefined) {
                bank.name = name;
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                await bank.save();
                req.flash('alertMessage', 'Success Update bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            } else {
                await fs.unlink(path.join(`public/${bank.imageUrl}`));
                bank.name = name;
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                bank.imageUrl = `images/${req.file.filename}`;
                await bank.save();
                req.flash('alertMessage', 'Success Update bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    deleteBank : async (req,res) => {
        try {
            const {id} = req.params;
            const bank = await Bank.findOne({_id : id});
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            await bank.remove();
            req.flash('alertMessage', 'Success Delete Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },
    viewItem : async (req,res) => {
        try {
            // populate
            const item = await Item.find()
                .populate({ path: 'imageId', select:'id imageUrl'})
                .populate({ path: 'categoryId', select: 'id name'});
            console.log(item);
            // cari cbank dari database
            const category = await Category.find();
            // const item = await Item.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus}
            // console.log(bank);
            // render bank
            res.render('admin/item/view_item', {
                alert,
                category,
                item,
                title : 'Staycation | Item',
                action : 'view',
                user : req.session.user
            });
        } catch (error) { 
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');

        }
    },
    addItem : async (req,res) => {
        try {
            const {categoryId, title, price, city, about} = req.body;
            // console.log(req.body);
            if(req.files.length > 0) {
                const category = await Category.findOne({_id: categoryId});
                const newItem = {
                    categoryId,
                    title,
                    description: about,
                    price,
                    city
                }
                // console.log(newItem);
                const item = await Item.create(newItem);
                console.log('ITEM = ' + item);
                category.itemId.push({_id : item._id});
                await category.save();
                for(let i = 0; i < req.files.length; i++){
                    const imageSave = await Image.create({imageUrl : `images/${req.files[i].filename}`});
                    item.imageId.push({_id: imageSave._id});
                    await item.save();
                }
                req.flash('alertMessage', 'Success Add Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    showImageItem : async (req,res) => {
        try {
            const {id} = req.params;
            // populate
            const item = await Item.findOne({_id: id})
                .populate({ path: 'imageId', select:'id imageUrl'})
                // .populate({ path: 'categoryId', select: 'id name'});
            console.log(item);
            // cari cbank dari database
            const category = await Category.find();
            // const item = await Item.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus}
            // console.log(bank);
            // render bank
            res.render('admin/item/view_item', {
                alert,
                category,
                item,
                title : 'Staycation | Show Image Item',
                action : 'show image',
                user : req.session.user
            });
            
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    showEditItem : async (req,res) => {
        try {
            const {id} = req.params;
            // populate
            const item = await Item.findOne({_id: id})
                .populate({ path: 'imageId', select:'id imageUrl'})
                .populate({ path: 'categoryId', select: 'id name'});
            // console.log(item);
            // cari cbank dari database
            const category = await Category.find();
            // const item = await Item.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus}
            // console.log(bank);
            // render bank
            res.render('admin/item/view_item', {
                alert,
                category,
                item,
                title : 'Staycation | Edit Item',
                action : 'edit',
                user : req.session.user
            });
            
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    editItem : async (req,res) => {
        try {
            const {id} = req.params;
            const {categoryId, title, price, city, about} = req.body;
            // populate
            const item = await Item.findOne({_id: id})
                .populate({ path: 'imageId', select:'id imageUrl'})
                .populate({ path: 'categoryId', select: 'id name'});
            if (req.files.length > 0) {
                for(let i = 0; i < item.imageId.length; i++) {
                    const imageUpdate = await Image.findOne({_id : item.imageId[i]._id});
                    await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
                    imageUpdate.imageUrl = `images/${req.files[i].filename}`;
                    await imageUpdate.save();
                }
                item.title=title;
                item.price=price;
                item.city=city;
                item.description=about;
                item.categoryId=categoryId;
                await item.save();
                req.flash('alertMessage', 'Success Update Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item');
            } else {
                item.title=title;
                item.price=price;
                item.city=city;
                item.description=about;
                item.categoryId=categoryId;
                await item.save();
                req.flash('alertMessage', 'Success Update Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    deleteItem : async (req,res) => {
        try {
            const {id} = req.params;
            // ada populate imageidnya
            const item = await Item.findOne({_id : id}).populate('imageId');
            // looping untuk ngecek gambar gambar yang berkaitan dengan id tsb
            for (let i = 0; i < item.imageId.length; i++) {
                Image.findOne({_id: item.imageId[i]._id}).then((image) => {
                    fs.unlink(path.join(`public/${image.imageUrl}`));
                    image.remove();
                }).catch((error) => {
                    req.flash('alertMessage', `${error.message}`);
                    req.flash('alertStatus', 'danger');
                    res.redirect('/admin/item');
                });
            }
            await item.remove();
            req.flash('alertMessage', 'Success Delete item');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/item');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    viewDetailItem: async (req,res) => {
        const {itemId} = req.params;
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus};
            const feature = await Feature.find({itemId : itemId});
            const activity = await Activity.find({itemId : itemId});
            // console.log(feature);
            res.render('admin/item/detail_item/view_detail_item', {
                title : 'Staycation | Detail Item',
                alert,
                itemId,
                feature,
                activity,
                user : req.session.user
            });

        } catch (error) { 
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    addFeature : async (req,res) => {
        const {name, qty, itemId} = req.body;
        // console.log('REQBODY ADDFEATURE = ', req.body)
        try {
            if (!req.file) {
                req.flash('alertMessage', 'Image Not Found');
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
            console.log('ADDFEATURE = ' + req.file);
            const feature = await Feature.create({
                name,
                qty,
                itemId,
                imageUrl: `images/${req.file.filename}`
            });

            const item = await Item.findOne({_id:itemId});
            item.featureId.push({_id:feature._id});
            await item.save();
            req.flash('alertMessage', 'Success Add Feature');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    editFeature : async (req, res) => {
        const {id, name, qty, itemId} = req.body;
        try {
            // console.log('EDITCATEGORY - ID = ' + id);
            const feature = await Feature.findOne({_id : id});
            // console.log('EDITCATEGORY - CATEGORY = ' + category);
            if (req.file == undefined) {
                feature.name = name;
                feature.qty = qty;
                await feature.save();
                req.flash('alertMessage', 'Success Update Feature');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            } else {
                await fs.unlink(path.join(`public/${feature.imageUrl}`));
                feature.name = name;
                feature.qty = qty;
                feature.imageUrl = `images/${req.file.filename}`;
                await feature.save();
                req.flash('alertMessage', 'Success Update Feature');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    deleteFeature : async (req,res) => {
        const {id, itemId} = req.params;
        // console.log(id, itemId)
        try {
            const feature = await Feature.findOne({_id : id});
            console.log("FEATURE = " + feature);

            const item = await Item.findOne({_id : itemId}).populate('featureId');
            console.log("FEATURE_ITEM = " + item)

            // const category = await Category.findOne({_id : categoryId}).populate('itemId');
            // console.log("FEATURE_ITEM_CATEGORY = " + category)
            // Ga bisa narik populate featureID, karena tadi _id : Id. Kaga distate featureID nya
            // Trus ini ngga bisa populate karena... ngga distate diform action dan admin router
            for(let i=0; i < item.featureId.length; i++) {
                if (item.featureId[i]._id.toString() === feature._id.toString()) {
                    item.featureId.pull({_id :feature._id});
                    await item.save();
                }
            }
            await fs.unlink(path.join(`public/${feature.imageUrl}`));
            await feature.remove();
            req.flash('alertMessage', 'Success Delete Feature');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    addActivity : async (req,res) => {
        const {name, type, itemId} = req.body;
        console.log('REQBODY ADDACTIVITY = ', req.body)
        try {
            if (!req.file) {
                req.flash('alertMessage', 'Image Not Found');
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
            console.log('ADDFEATURE = ' + req.file);
            const activity = await Activity.create({
                name,
                type,
                itemId,
                imageUrl: `images/${req.file.filename}`
            });

            const item = await Item.findOne({_id:itemId});
            item.activityId.push({_id:activity._id});
            await item.save();
            req.flash('alertMessage', 'Success Add Activity');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    editActivity : async (req, res) => {
        const {id, name, type, itemId} = req.body;
        try {
            // console.log('EDITCATEGORY - ID = ' + id);
            const activity = await Activity.findOne({_id : id});
            // console.log('EDITCATEGORY - CATEGORY = ' + category);
            if (req.file == undefined) {
                activity.name = name;
                activity.type = type;
                await activity.save();
                req.flash('alertMessage', 'Success Update Activity');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            } else {
                await fs.unlink(path.join(`public/${activity.imageUrl}`));
                activity.name = name;
                activity.type = type;
                activity.imageUrl = `images/${req.file.filename}`;
                await activity.save();
                req.flash('alertMessage', 'Success Update Activity');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    deleteActivity : async (req,res) => {
        const {id, itemId} = req.params;
        // console.log(id, itemId)
        try {
            const activity = await Activity.findOne({_id : id});
            console.log("activity = " + activity);

            const item = await Item.findOne({_id : itemId}).populate('activityId');
            console.log("ACTIVITY_ITEM = " + item)

            // const category = await Category.findOne({_id : categoryId}).populate('itemId');
            // console.log("FEATURE_ITEM_CATEGORY = " + category)
            // Ga bisa narik populate featureID, karena tadi _id : Id. Kaga distate featureID nya
            // Trus ini ngga bisa populate karena... ngga distate diform action dan admin router
            for(let i=0; i < item.featureId.length; i++) {
                if (item.activityId[i]._id.toString() === activity._id.toString()) {
                    item.activityId.pull({_id :activity._id});
                    await item.save();
                }
            }
            await fs.unlink(path.join(`public/${activity.imageUrl}`));
            await activity.remove();
            req.flash('alertMessage', 'Success Delete Activity');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    viewBooking : async (req,res) => {
        try {
            const booking = await Booking.find()
                .populate('memberId')
                .populate('bankId')
                .populate('itemId')

            console.log(booking);

            
            res.render('admin/booking/view_Booking', {
                booking,
                title : 'Staycation | Booking',
                user : req.session.user
            });
        } catch (error) {
            res.redirect('admin/booking')
        }
    },
    showDetailBooking: async (req,res) => {
        const {id} = req.params;
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus};

            const booking = await Booking.find({_id : id})
                .populate('memberId')
                .populate('bankId')
                .populate('itemId');

            console.log(booking);
            res.render('admin/booking/show_detail_booking', {
                title : 'Staycation | Detail Booking',
                alert,
                booking,
                user : req.session.user
            });

        } catch (error) { 
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('admin/booking/show_detail_booking');
        }
    },
    actionConfirmation: async (req,res) => {
        const {id} = req.params;
        try {
            const booking = await Booking.findOne({_id : id});
            booking.payments.status = 'Accept';
            await booking.save();
            req.flash('alertMessage', 'Success Approve Booking');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/booking/${id}`);
            
        } catch (error) {
            res.redirect(`/admin/booking/${id}`);
        }
    },
    actionReject: async (req,res) => {
        const {id} = req.params;
        try {
            const booking = await Booking.findOne({_id : id});
            booking.payments.status = 'Reject';
            await booking.save();
            req.flash('alertMessage', 'Success Reject Booking');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/booking/${id}`);
            
        } catch (error) {
            res.redirect(`/admin/booking/${id}`);
        }
    }
}