define(function(){
    'use strict';

    var requiredFields = [
        'Delivery Route',
        'Customer Number',
        'Customer First Name',
        'Customer Last Name',
        'Box Type',
        'Box Likes',
        'Box Dislikes',
        'Box Extra Line Items'
    ];

    // Convert string to variable-style camel case -> Customer First Name -> customerFirstName
    // NOTE: expects capitalised string
    function camelCase(str){
        return str.replace(/\s/g, '').replace(/^./, function(c) { return c.toLowerCase(); });
    }

    return {

        // Ensure the correct headings are included
        validateHeadings: function(headingsLine){
            var headings = $.csv.toArray(headingsLine);
            var missingFields = [];

            _(requiredFields).each(function(field){
                var index = headings.indexOf(field);

                if(index === -1){
                    missingFields.push(field);
                }
            });

            return missingFields;
        },

        // Ensure the contents of the file data are correct
        validateContents: function(data){
            var lines = data.split('\n');
            var missingFields;

            if(!lines.length){
                return 'No data found in file, not even the headers';
            } else if (lines.length === 1){
                return 'No records found in file';
            }

            missingFields = this.validateHeadings(lines[0]);

            if(missingFields.length){
                return 'Could not find the following required information: ' + missingFields.join(', ');
            }
        },

        parse: function(data, done){
            var records;
            var validationError = this.validateContents(data);

            if(validationError){
                return done(validationError);
            }

            records = $.csv.toObjects(data);

            console.log(records);

            // Convert the record keys to 'variable' style
            records = _(records).map(function(record) {
                return _(record).reduce(function(memo, value, key) {
                    memo[camelCase(key)] = value;
                    return memo;
                }, {});
            });

            done(null, records);
        }
    };

});