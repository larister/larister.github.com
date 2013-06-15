require([
    'mustache!packingRecord',
    'mustache!packingTotals'
], function(
    packingRecordTemplate,
    packingTotalsTemplate
){
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

    // Check for the various File API support.
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        return alert('The File APIs are not fully supported in this browser.');
    }

    // Ensure the correct headings are included
    function validateHeadings(headingsLine){
        var headings = $.csv.toArray(headingsLine);
        var missingFields = [];

        _(requiredFields).each(function(field){
            var index = headings.indexOf(field);

            if(index === -1){
                missingFields.push(field);
            }
        });

        return missingFields;
    }

    // Convert string to variable-style camel case -> Customer First Name -> customerFirstName
    // NOTE: expects capitalised string
    function camelCase(str){
        return str.replace(/\s/g, '').replace(/^./, function(c) { return c.toLowerCase(); });
    }

    function aggregateBoxExtras(boxExtras){
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
    }

    function calculateTotals(records){
        // Yes we're doing two loops here. No I don't care, it makes things a lot nicer.
        var boxTypes = _(records).countBy(function(record) { return record.boxType; });
        var extras = _(records).pluck('boxExtraLineItems');
        var exraTotals = aggregateBoxExtras(extras);

        return {
            deliveryRoute: records[0].deliveryRoute, // Pluck out the round name from the first record (they're all the same)
            boxTotals: formatTotals(boxTypes),
            extraTotals: formatTotals(exraTotals)
        };
    }

    // Convert the totals into template-friendly format, i.e. '{boxA: 12}' -> {item: 'boxA', total: '12'}
    function formatTotals(totals){
        var formattedTotals = _(totals).map(function(value, key){
            return {
                'total': value,
                'item': key
            };
        });

        return formattedTotals;
    }

    function parseContents(result){
        var lines = result.split('\n');
        var records;
        var missingFields;

        if(!lines.length){
            return alertify.alert('No data found in file, not even the headers');
        } else if (lines.length === 1){
            return alertify.alert('No records found in file');
        }

        missingFields = validateHeadings(lines[0]);

        if(missingFields.length){
            return alertify.alert('Could not find the following required information: \n' + missingFields.join(', '));
        }

        records = $.csv.toObjects(result);

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
            totals: calculateTotals(records)
        };
    }

    function render(data){
        var $records = $('#records');

        $records.html('<h2>Customer Details for ' + data.records[0].deliveryRoute + '</h2>');

        _(data.records).each(function(record){
            $records.append(packingRecordTemplate(record));
        });
        $records.append(packingTotalsTemplate(data.totals));
    }

    function handleFileSelect(e) {
        var files = e.target.files; // FileList object

        // files is a FileList of File objects. List some properties.
        var output = [];

        _(files).each(function(f){
            output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');

            var reader = new FileReader();

            reader.onload = (function(){
                return function(e){
                    if(!e || !e.target || !e.target.result){
                        return alertify.alert('Could not find any data');
                    }

                    render(parseContents(e.target.result));
                };
            })(f);

            reader.readAsText(f);
        });
        $('#fileDataList').html('<ul>' + output.join('') + '</ul>');
    }

    $('#files').on('change', handleFileSelect);

});