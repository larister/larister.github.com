define(function(){
    'use strict';

    return {

        aggregateBoxExtras: function(boxExtras){
            var quantityRegexp = /(?:\(x)([0-9]+)(?:\))/;
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

                    var quantityMatch = quantityRegexp.exec(item);
                    var quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 1;
                    // Horrible. Must learn regex better :()
                    var itemName = quantityMatch ? item.substring(0, item.indexOf('(x') - 1) : item;

                    if(!memo[itemName]){
                        memo[itemName] = quantity;
                    } else {
                        memo[itemName] = memo[itemName] + quantity;
                    }
                });

                return memo;
            }, {});

            return extraTotals;
        },

        // Convert the totals into template-friendly format, i.e. {boxA: 12} -> {item: 'boxA', total: '12'}
        formatTotals: function(totals){
            var formattedTotals = _(totals).map(function(value, key){
                return {
                    'total': value,
                    'item': key
                };
            });

            return formattedTotals;
        },

        calculateRoundTotals: function(records){
            // Yes we're doing two loops here. No I don't care, it makes things a lot nicer.
            var boxTypes = _(records).countBy(function(record) { return record.boxType; });
            var extras = _(records).pluck('boxExtraLineItems');
            var extraTotals = this.aggregateBoxExtras(extras);

            return {
                deliveryService: records[0].deliveryService, // Pluck out the round name from the first record (they're all the same)
                boxTotals: boxTypes,
                extraTotals: extraTotals
            };
        },

        calculateGrandTotals: function(totals) {
            var grandTotals = _(totals).reduce(function(memo, roundTotals) {
                _(roundTotals.boxTotals).each(function(total, boxName) {
                    memo.boxTotals[boxName] = memo.boxTotals[boxName] ? memo.boxTotals[boxName] + total : total;
                });
                _(roundTotals.extraTotals).each(function(total, extraName) {
                    memo.extraTotals[extraName] = memo.extraTotals[extraName] ? memo.extraTotals[extraName] + total : total;
                });
                return memo;
            }, {
                boxTotals: {},
                extraTotals: {}
            });

            return grandTotals;
        },

        calculateTotals: function(rounds){
            return _(rounds).map(this.calculateRoundTotals, this);
        }

    };

});