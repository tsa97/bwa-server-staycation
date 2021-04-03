const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');
const fs = require('fs');

chai.use(chaiHttp);

// testing GET Landing Page
describe('API ENDPOINT TESTING', () => {
    it('GET Landing Page', (done) => {
        chai.request(app).get('/api/v1/member/landing-page').end((err,res) => {
            //kalo error, display null
            expect(err).to.be.null
            // status 200 kalo success
            expect(res).to.have.status(200)
            // resbody formatnya obj
            expect(res.body).to.be.an('Object')
            // resbody nama propnya hero
            expect(res.body).to.have.property('hero')
            // resbody hero punya semua keys bernama trav,tre,cities
            expect(res.body.hero).to.have.all.keys(
                'traveller',
                'treasure',
                'city'
                )
            // resbody nama propnya mostPicked
            expect(res.body).to.have.property('mostPicked')
            // resbody mostPicked formatnya array
            expect(res.body.mostPicked).to.be.an('Array')
            // resbody nama propnya category
            expect(res.body).to.have.property('category')
            // resbody category formatnya array
            expect(res.body.category).to.be.an('Array')
            // resbody nama propnya testimonial
            expect(res.body).to.have.property('testimonial')
            // resbody testimonial formatnya object
            expect(res.body).to.be.an('Object')
            done();
        })
    })

    it('GET Detail Page', (done) => {
        chai.request(app).get('/api/v1/member/detail-page/5e96cbe292b97300fc902222').end((err,res) => {
            //kalo error, display null
            expect(err).to.be.null
            // status 200 kalo success
            expect(res).to.have.status(200)
            // resbody formatnya obj
            expect(res.body).to.be.an('Object')
            // resbody nama propnya country
            expect(res.body).to.have.property('country')
            // resbody nama propnya isPopular
            expect(res.body).to.have.property('isPopular')
            // resbody nama propnya unit
            expect(res.body).to.have.property('unit')
            // resbody nama propnya sumBooking
            expect(res.body).to.have.property('sumBooking')

            // resbody nama propnya imageId
            expect(res.body).to.have.property('imageId')
            // resbody imageId formatnya array
            expect(res.body.imageId).to.be.an('Array')
            // expect(res.body.imageId).to.be.an('Object')

            // resbody nama propnya featureId
            expect(res.body).to.have.property('featureId')
            // resbody imageId formatnya array
            expect(res.body.featureId).to.be.an('Array')
            // expect(res.body.featureId).to.be.an('Object')

            // resbody nama propnya activityId
            expect(res.body).to.have.property('activityId')
            // resbody imageId formatnya array
            expect(res.body.activityId).to.be.an('Array')
            // expect(res.body.activityId).to.be.an('Object')

            // resbody nama propnya _id
            expect(res.body).to.have.property('_id')
            // resbody nama propnya title
            expect(res.body).to.have.property('title')
            // resbody nama propnya price
            expect(res.body).to.have.property('price')
            // resbody nama propnya city
            expect(res.body).to.have.property('city')
            // resbody nama propnya description
            expect(res.body).to.have.property('description')

            // resbody nama propnya bank
            expect(res.body).to.have.property('bank')
            // resbody imageId formatnya array
            expect(res.body.bank).to.be.an('Array')

            // resbody nama propnya testimonial
            expect(res.body).to.have.property('testimonial')
            // resbody imageId formatnya array
            // expect(res.body.testimonial).to.be.an('Array')
            expect(res.body.testimonial).to.be.an('Object')
            done();
        })
    })

    it('POST Booking Page', (done) => {
        const image = __dirname + '/buktibayar.jpeg';
        const dataSample = {
            image,
            idItem: '5e96cbe292b97300fc902222',
            duration: '4',
            bookingStartDate: '9-4-2021',
            bookingEndDate: '13-4-2021',
            firstName: 'Joko',
            lastName: 'Anwar',
            email: 'jokoanwar@gmail.com',
            phoneNumber: '08545002181',
            accountHolder: 'Joko Anwar',
            bankFrom: 'Hana Bank',
        }
        console.log('POST Booking Page - Done Data Sample')
        chai.request(app)
            .post('/api/v1/member/booking-page')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .field('idItem', dataSample.idItem)
            .field('duration', dataSample.duration)
            .field('bookingStartDate', dataSample.bookingStartDate)
            .field('bookingEndDate', dataSample.bookingEndDate)
            .field('firstName', dataSample.firstName)
            .field('lastName', dataSample.lastName)
            .field('email', dataSample.email)
            .field('phoneNumber', dataSample.phoneNumber)
            .field('accountHolder', dataSample.accountHolder)
            .field('bankFrom', dataSample.bankFrom)
            .attach('image', fs.readFileSync(dataSample.image), 'buktibayar.jpeg')
            .end((err,res) => {
                //kalo error, display null
                expect(err).to.be.null
                // status 201 kalo success
                expect(res).to.have.status(201)
                // resbody formatnya obj
                expect(res.body).to.be.an('Object')
                expect(res.body).to.have.property('message')
                expect(res.body.message).to.equal('Success Booking')
                expect(res.body).to.have.property('booking')
                expect(res.body.booking).to.have.all.keys(
                    'payments',
                    '_id',
                    'invoice',
                    'bookingStartDate',
                    'bookingEndDate',
                    'total',
                    'itemId',
                    'memberId',
                    '__v'
                    )
                expect(res.body.booking.payments).to.have.all.keys(
                    'status',
                    'proofPayment',
                    'bankFrom',
                    'accountHolder'
                )
                expect(res.body.booking.itemId).to.have.all.keys(
                    '_id',
                    'title',
                    'price',
                    'duration'
                )
                done();
            })
    })
})