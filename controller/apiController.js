const Item = require('../models/Item');
const Activity = require('../models/Activity');
const Booking = require('../models/Booking');
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Member = require('../models/Member');

module.exports = {
    landingPage : async (req,res) => {
        try {
            const mostPicked = await Item.find()
                .select('_id title country city price unit imageId')
                .limit(5)
                .populate({ path : 'imageId', select : '_id imageUrl'})

            const category = await Category.find()
                .select('_id name')
                .limit(3)
                .populate({
                    path : 'itemId',
                    select : '_id title country city isPopular imageId',
                    perDocumentLimit : 4,
                    option : {sort: {sumBooking:-1}},
                    populate : {
                        path : 'imageId',
                        select : '_id imageUrl',
                        perDocumentLimit : 1
                    }
                })
            const treasure = await Activity.find()
            const traveller = await Booking.find()
            const city = await Item.find()

            for (let i=0; i < category.length; i++) {
                for(let x=0; x < category[i].itemId.length; x++) {
                    // console.log(category[i].itemId[x])
                    const item = await Item.findOne({_id : category[i].itemId[x]._id});
                    item.isPopular = false;
                    await item.save();
                    if (category[i].itemId[0] === category[i].itemId[x]) {
                        item.isPopular = true;
                        await item.save();
                    }
                }
            }

            const testimonial = {
                _id : "asdasdasd",
                imageUrl : "images/1616292793127.JPG",
                name : "Happy Family",
                rate : 4.55,
                content : "I should try this",
                familyName : "Adri",
                familyOccupation : "Banker"
            }

            res.status(200).json({ 
                hero : {
                    treasure : treasure.length,
                    traveller : traveller.length,
                    city : city.length

                },
                mostPicked,
                category,
                testimonial
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({message : "Internal Server Error"})
        }
    },

    detailPage : async (req, res) => {
        try {
            const {id} = req.params;
            const item = await Item.findOne({_id : id})
                .populate({ path : 'imageId', select : '_id imageUrl'})
                .populate({ path : 'featureId', select : '_id name qty imageUrl'})
                .populate({ path : 'activityId', select : '_id name type imageUrl'})

            const bank = await Bank.find();

            const testimonial = {
                _id : "asdasdasd",
                imageUrl : "images/1616292793127.JPG",
                name : "Happy Family",
                rate : 4.55,
                content : "I should try this",
                familyName : "Adri",
                familyOccupation : "Banker"
            }

            res.status(200).json({
                ...item._doc,
                bank,
                testimonial
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({message : "Internal Server Error"})   
        }
    },

    bookingPage : async (req, res) => {
        const {
            idItem,
            duration,
            // price,
            bookingStartDate,
            bookingEndDate,
            firstName,
            lastName,
            email,
            phoneNumber,
            accountHolder,
            bankFrom
        } = req.body;

        if (!req.file) {
            return res.status(404).json({message: "Image Not Found"})
        }

        if (
            idItem === undefined || 
            duration === undefined || 
            // price === undefined || 
            bookingStartDate === undefined || 
            bookingEndDate === undefined || 
            firstName === undefined || 
            lastName === undefined || 
            email === undefined || 
            phoneNumber === undefined || 
            accountHolder === undefined || 
            bankFrom === undefined) {
            return res.status(404).json({message: "Incomplete Field in Requested Data"})
        }

        const item = await Item.findOne({_id: idItem});

        if (!item) {
            return res.status(404).json({message: "Item not found"})
        }

        item.sumBooking += 1;

        await item.save();

        let total = item.price * duration;
        let tax = total * 0.10

        const invoice = Math.floor(1000000 + Math.random() * 9000000);

        console.log(total)
        console.log(tax)
        console.log(invoice)

        const member = await Member.create({
            firstName,
            lastName,
            email,
            phoneNumber
        });

        const newBooking = {
            invoice,
            bookingStartDate,
            bookingEndDate,
            total : total += tax,
            itemId : {
                _id : item.id,
                title : item.title,
                price : item.price,
                duration : duration
            },
            memberId : member.id,
            payments: {
                proofPayment : `images/${req.file.filename}`,
                bankFrom : bankFrom,
                accountHolder : accountHolder
            }

        }

        const booking = await Booking.create(newBooking);


        // 201 membawa data baru
        res.status(201).json({message: "Success Booking", booking})
    }
}