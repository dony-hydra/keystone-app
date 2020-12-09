const {Text, Checkbox, CalendarDay} = require('@keystonejs/fields');

module.exports = {
    fields:{
        description: {
            type: Text,
            isRequired: true
        },
        isComplete: {
            type: Checkbox,
            defaultValue: false
        },
        deadline:{
            type: CalendarDay,
            dateFrom: '2020-01-01',
            dateTo:'2029-01-01',
            isRequired: true,
            defaultValue: new Date().toString('YYYY-MM-DD').substring(0.10)
        },
        assignee: {
            type: Text,
            defaultValue: true
        }
    }
}