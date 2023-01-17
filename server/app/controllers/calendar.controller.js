/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
//const { hashSync } = require('bcryptjs');
const bcrypt = require('bcryptjs');
const db = require('../models');

const CalendarEvent = db.calendarEvent;


exports.getEvents = (req, res) => {
  CalendarEvent.findAll({
  }).then((rows) => {
    //console.log(rows);
    const lists = [];
    rows.map((row) => {
      const { id, allDay, description, end, start, title} = row;
      const data = {
        id,
        allDay,
        description,
        end,
        start,
        title,
        
      };
      lists.push(data);
    });
    res.status(200).send({ lists });
  });

}

exports.create = (req, res) => {
    console.log(req.body); 
    CalendarEvent.create({
      ...req.body.event
    }).then((event) => {
      console.log(event);
      const newEvent = {
        id:event.id,
        ...req.body.event
      };
      res.status(200).json(newEvent)
    }).catch((error) => {
    })

}

exports.update = (req, res) => {
  CalendarEvent.update(
    {
      ...req.body.update
    },
    { where: { id: req.body.id } }
  ).then(() => {
      CalendarEvent.findOne({
        where: {
          id: req.body.id
        }
      }).then((row) => {
        const { id, allDay, description, end, start, title} = row;
        const event = {
          id,
          allDay,
          description,
          end,
          start,
          title,
        };
        res.status(200).json(event);
      })
    })
    .catch((error) => {
      console.log('error', error);
    });
}






