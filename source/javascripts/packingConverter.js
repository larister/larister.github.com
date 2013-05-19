$(function() {

    _.templateSettings = _(_.templateSettings).extend({
        interpolate : /\{\{(.+?)\}\}/g
    });

    var CUSTOMER_NUM = 'Customer Number';
    var CUSTOMER_FIRSTNAME = 'Customer First Name';
    var CUSTOMER_LASTNAME = 'Customer Last Name';
    var BOX_TYPE = 'Box Type';
    var BOX_LIKES = 'Box Likes';
    var BOX_DISLIKES = 'Box Dislikes';
    var BOX_EXTRAS = 'Box Extra Line Items';
    var requiredFields = [CUSTOMER_NUM, CUSTOMER_FIRSTNAME, CUSTOMER_LASTNAME, BOX_TYPE, BOX_LIKES, BOX_DISLIKES, BOX_EXTRAS];

    // Check for the various File API support.
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        return alert('The File APIs are not fully supported in this browser.');
    }

    function parseHeadings(headingsLine){
        var headings = $.csv.toArray(headingsLine);
        var positions = {};

        _(requiredFields).each(function(field){
            var index = headings.indexOf(field);

            if(index === -1){
                throw new Error('Could not find required header: ' + field);
            }
            positions[field] = index;
        });

        return positions;
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
        var extras = _(records).pluck('boxExtras');

        console.log(boxTypes);

        return {
            boxTotals: boxTypes,
            extraTotals: aggregateBoxExtras(extras)
        };
    }

    function parseContents(result){
        var lines = result.split('\n');
        var headingPositions;
        var records = [];
        var totals;

        if(!lines.length){
            throw new Error('No data found in file, not even the headers');
        } else if (lines.length === 1){
            throw new Error('No records found in file');
        }

        headingPositions = parseHeadings(lines[0]);

        _(lines.slice(1)).chain()
            .reject(function(item) { return _(item).isEmpty(); })
            .each(function(line){
                var fields = $.csv.toArray(line);
                var record = {};

                record.id = fields[headingPositions[CUSTOMER_NUM]];
                record.firstName = fields[headingPositions[CUSTOMER_FIRSTNAME]];
                record.lastName = fields[headingPositions[CUSTOMER_LASTNAME]];
                record.boxType = fields[headingPositions[BOX_TYPE]];
                record.boxLikes = fields[headingPositions[BOX_LIKES]];
                record.boxDislikes = fields[headingPositions[BOX_DISLIKES]];
                record.boxExtras = fields[headingPositions[BOX_EXTRAS]];

                records.push(record);
        });
        console.log(records);

        return {
            records: records,
            totals: calculateTotals(records)
        };
    }

    function render(data){
        var output = [];
        var recordTemplate = _.template(
            '<div class="record">' +
            '<div>Customer Number: {{id}}</div>' +
            '<div>First Name: {{firstName}}</div>' +
            '<div>Last Name: {{lastName}}</div>' +
            '<div>Box Type: {{boxType}}</div>' +
            '<div>Box Likes: {{boxLikes}}</div>' +
            '<div>Box Dislikes: {{boxDislikes}}</div>' +
            '<div>Box Extras: {{boxExtras}}</div>' +
            '</div>'
        );
        var boxTotalsTemplate = _.template(
            '<div class="total">' +
            '<% _.each(boxTotals, function(value, key) { %> <div>{{value}} x {{key}}</div> <% }); %>' +
            '</div>' +
            '<div class="total">' +
            '<% _.each(extraTotals, function(value, key) { %> <div>{{value}} x {{key}}</div> <% }); %>' +
            '</div>'
        );

        _(data.records).each(function(record){
            output.push(recordTemplate(record));
        });
        output.push(boxTotalsTemplate(data.totals));

        $('#records').html(output.join(''));
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

            reader.onload = (function(theFile){
                return function(e){
                    if(!e || !e.target || !e.target.result){
                        throw new Error('Could not find any data');
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