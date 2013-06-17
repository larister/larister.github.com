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

        aggregateBoxExtras: function(boxExtras){
            var quantityRegexp = /[0-9]+(?=x)/;
            var extraTotals;

            extraTotals = _(boxExtras).reduce(function(memo, extrasEntry){
                if(_(extrasEntry).isEmpty()){
                    return memo;
                }

                var items = $.csv.toArray(extrasEntry);

                _(items).each(function(item){
                    if(item === '') {
                        return;
                    }

                    var quantity = quantityRegexp.exec(item);
                    // Horrible. Must learn regex better :()
                    var itemName = item.substring(item.indexOf('x ') + 2);

                    if(!quantity.length){
                        return console.warn('Could not find quantity for: ' + item);
                    }
                    if(!memo[itemName]){
                        memo[itemName] = parseInt(quantity, 10);
                    } else {
                        memo[itemName] = memo[itemName] + parseInt(quantity, 10);
                    }
                });

                return memo;
            }, {});

            return extraTotals;
        },

        calculateTotals: function(records){
            // Yes we're doing two loops here. No I don't care, it makes things a lot nicer.
            var boxTypes = _(records).countBy(function(record) { return record.boxType; });
            var extras = _(records).pluck('boxExtraLineItems');
            var exraTotals = this.aggregateBoxExtras(extras);

            return {
                deliveryRoute: records[0].deliveryRoute, // Pluck out the round name from the first record (they're all the same)
                boxTotals: this.formatTotals(boxTypes),
                extraTotals: this.formatTotals(exraTotals)
            };
        },

        // Convert the totals into template-friendly format, i.e. '{boxA: 12}' -> {item: 'boxA', total: '12'}
        formatTotals: function(totals){
            var formattedTotals = _(totals).map(function(value, key){
                return {
                    'total': value,
                    'item': key
                };
            });

            return formattedTotals;
        },

        parseContents: function(data){
            var records;
            var validationError = this.validateContents(data);

            if(validationError){
                return {error: validationError};
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

            return {
                records: records,
                totals: this.calculateTotals(records)
            };
        }
    };

});