/**
 * @author mickael desgranges
 * @desc http://mkdgs.fr
 * @version 0000
 * rewrited as jquery plugin 
 * original https://github.com/philipehsing/jQuery.Simple-Event-Calendar
 * 
 */
(function ($) {
    "use strict";
    var methods = {};
    var pluginName = 'simpleCalendar'; 	// set plugin name
    var options = {// set efault options
        'default': 'option'
    };

    var mon = 'Lun';
    var tue = 'Mar';
    var wed = 'Mer';
    var thur = 'Jeu';
    var fri = 'Ven';
    var sat = 'Sam';
    var sund = 'Dim';
    var $ = jQuery;

    /**
     * Get current date
     */
    var d = new Date();
    var strDate = yearNumber + "/" + (d.getMonth() + 1) + "/" + d.getDate();
    var yearNumber = (new Date).getFullYear();
    /**
     * Get current month and set as '.current-month' in title
     */
    var monthNumber = d.getMonth() + 1;

    var GetMonthName = function (monthNumber) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthNumber - 1];
    };

    var setMonth = function (monthNumber, mon, tue, wed, thur, fri, sat, sund) {
        $('.month').text(GetMonthName(monthNumber) + ' ' + yearNumber);
        $('.month').attr('data-month', monthNumber);
        printDateNumber(monthNumber, mon, tue, wed, thur, fri, sat, sund);
    };


    var remove = function () {
        $('.remove').click(function () {
            if (this.checked) {
                $(this).next().text('Remove from personal list');
                var eventMonth = $(this).closest('.day').attr('date-month');
                var eventDay = $(this).closest('.day').attr('date-day');
                var eventNumber = $(this).closest('.day').attr('data-number');
                $('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').slideUp('slow');
                $('.day-event[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').find('.save').attr('checked', false);
                $('.day-event[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').find('span').text('Save to personal list');
                setTimeout(function () {
                    $('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').remove();
                }, 1500);
            }
        });
    };

    /**
     * Sort personal list
     */
    var sortlist = function () {
        var personList = $('.person-list');
        personList.find('.day').sort(function (a, b) {
            return +a.getAttribute('date-day') - +b.getAttribute('date-day');
        }).appendTo(personList);
    };

    /**
     * Get current day and set as '.current-day'
     */
    var setCurrentDay = function (month, year) {
        var viewMonth = $('.month').attr('data-month');
        var eventYear = $('.event-days').attr('date-year');
        if (parseInt(year) === yearNumber) {
            if (parseInt(month) === parseInt(viewMonth)) {
                $('tbody.event-calendar td[date-day="' + d.getDate() + '"]').addClass('current-day');
            }
        }
    };

    var setDaysInOrder = function (monthNumber, mon, tue, wed, thur, fri, sat, sund) {
        var monthDay = getDaysInMonth(monthNumber - 1, yearNumber)[0].toString().substring(0, 3);
        if (monthDay === 'Mon') {
            $('thead.event-days tr').append('<td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td>');
        } else if (monthDay === 'Tue') {
            $('thead.event-days tr').append('<td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td>');
        } else if (monthDay === 'Wed') {
            $('thead.event-days tr').append('<td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td>');
        } else if (monthDay === 'Thu') {
            $('thead.event-days tr').append('<td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td>');
        } else if (monthDay === 'Fri') {
            $('thead.event-days tr').append('<td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td>');
        } else if (monthDay === 'Sat') {
            $('thead.event-days tr').append('<td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td>');
        } else if (monthDay === 'Sun') {
            $('thead.event-days tr').append('<td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td>');
        }
    };

    var getDaysInMonth = function (month, year) {
        // Since no month has fewer than 28 days
        var date = new Date(year, month, 1);
        var days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };


    /**
     * Add '.event' class to all days that has an event
     */
    var setEvent = function () {
        $('.day-event').each(function (i) {
            var eventMonth = $(this).attr('date-month');
            var eventDay = $(this).attr('date-day');
            var eventYear = $(this).attr('date-year');
            var eventClass = $(this).attr('event-class');
            if (eventClass === undefined)
                eventClass = 'event';
            else
                eventClass = 'event ' + eventClass;

            if (parseInt(eventYear) === yearNumber) {
                $('tbody.event-calendar tr td[date-month="' + eventMonth + '"][date-day="' + eventDay + '"]').addClass(eventClass);
            }
        });
    };

    /**
     * Get current day on click in calendar
     * and find day-event to display
     */
    var displayEvent = function () {
        $('tbody.event-calendar td').on('click', function (e) {
            $('.day-event').slideUp('fast');
            var monthEvent = $(this).attr('date-month');
            var dayEvent = $(this).text();
            $('.day-event[date-month="' + monthEvent + '"][date-day="' + dayEvent + '"]').slideDown('fast');
        });
    };


    /**
     * Get all dates for current month
     */
    var printDateNumber = function (monthNumber, mon, tue, wed, thur, fri, sat, sund) {
        $($('tbody.event-calendar tr')).each(function (index) {
            $(this).empty();
        });

        $($('thead.event-days tr')).each(function (index) {
            $(this).empty();
        });

        var i = 0;

        setDaysInOrder(monthNumber, mon, tue, wed, thur, fri, sat, sund);


        $(getDaysInMonth(monthNumber - 1, yearNumber)).each(function (index) {
            var index = index + 1;
            if (index < 8) {
                $('tbody.event-calendar tr.1').append('<td date-month="' + monthNumber + '" date-day="' + index + '" date-year="' + yearNumber + '">' + index + '</td>');
            } else if (index < 15) {
                $('tbody.event-calendar tr.2').append('<td date-month="' + monthNumber + '" date-day="' + index + '" date-year="' + yearNumber + '">' + index + '</td>');
            } else if (index < 22) {
                $('tbody.event-calendar tr.3').append('<td date-month="' + monthNumber + '" date-day="' + index + '" date-year="' + yearNumber + '">' + index + '</td>');
            } else if (index < 29) {
                $('tbody.event-calendar tr.4').append('<td date-month="' + monthNumber + '" date-day="' + index + '" date-year="' + yearNumber + '">' + index + '</td>');
            } else if (index < 32) {
                $('tbody.event-calendar tr.5').append('<td date-month="' + monthNumber + '" date-day="' + index + '" date-year="' + yearNumber + '">' + index + '</td>');
            }
            i++;
        });
        var date = new Date();
        var month = date.getMonth() + 1;
        var thisyear = new Date().getFullYear();
        setCurrentDay(month, thisyear);
        setEvent();
        displayEvent();
    };

    /* Lazy Loader get script path 
     */
    var scriptFilename = 'simplecalendar.js'; // don't forget to set the filename 
    var scriptUrl = (function () {
        if (document.currentScript) { // support defer & async (mozilla only)
            return document.currentScript.src;
        } else {
            var ls, s;
            var getSrc = function (ls, attr) {
                var i, l = ls.length, nf, s;
                for (i = 0; i < l; i++) {
                    s = null;
                    if (ls[i].getAttribute.length !== undefined) {
                        s = ls[i].getAttribute(attr, 2);
                    }
                    if (!s)
                        continue; // tag with no src
                    nf = s;
                    nf = nf.split('?')[0].split('/').pop(); // get script filename
                    if (nf === scriptFilename) {
                        return s;
                    }
                }
            };
            ls = document.getElementsByTagName('script');
            s = getSrc(ls, 'src');
            if (!s) { // search reference of script loaded by jQuery.getScript() in meta[name=srcipt][content=url]
                ls = document.getElementsByTagName('meta');
                s = getSrc(ls, 'content');
            }
            if (s)
                return s;
        }
        return '';
    })();

    var scriptPath = scriptUrl.substring(0, scriptUrl.lastIndexOf('/')) + "/";

    methods.init = function (params) {
        return this.each(function () {
            // an instance already exist ?
            var op = $(this).data(pluginName);
            if (op)
                return true; //IHAZ ONE CONTINUE

            op = jQuery.extend({}, options, params);
            this[pluginName] = op;	// reference for accessing an instance inside a method
            op.$el = $(this); 	// reference to this DOM object
            op.that = this; 	// reference to this object

            // awesome code here

            // set data instance
            $(this).data(pluginName, op);

            // start to work here 
            setMonth(monthNumber, mon, tue, wed, thur, fri, sat, sund);

            op.$el.on('click', '.btn-next' , function (e) {
                e.preventDefault();
                var monthNumber = $('.month', op.$el).attr('data-month');
                if (monthNumber > 11) {
                    $('.month', op.$el).attr('data-month', '0');
                    var monthNumber = $('.month', op.$el).attr('data-month');
                    yearNumber = yearNumber + 1;
                    setMonth(parseInt(monthNumber) + 1, mon, tue, wed, thur, fri, sat, sund);
                } else {
                    setMonth(parseInt(monthNumber) + 1, mon, tue, wed, thur, fri, sat, sund);
                }
                ;
            });

            op.$el.on('click', '.btn-prev' , function (e) {
                e.preventDefault();
                var monthNumber = $('.month', op.$el).attr('data-month');
                if (monthNumber < 2) {
                    $('.month', op.$el).attr('data-month', '13');
                    var monthNumber = $('.month', op.$el).attr('data-month');
                    yearNumber = yearNumber - 1;
                    setMonth(parseInt(monthNumber) - 1, mon, tue, wed, thur, fri, sat, sund);
                } else {
                    setMonth(parseInt(monthNumber) - 1, mon, tue, wed, thur, fri, sat, sund);
                }
                ;
            });

            /**
             * Add class '.active' on calendar date
             */
            op.$el.on('click', 'tbody td', function (e) {
                if ($(this).hasClass('event')) {
                    $('tbody.event-calendar td', op.$el).removeClass('active');
                    $(this).addClass('active');
                } else {
                    $('tbody.event-calendar td').removeClass('active');
                }
                ;
            });

            /**
             * Close day-event
             */
            op.$el.on('click',  '.close' , function (e) {
                $(this).parent().slideUp('fast');
            });

            /**
             * Save & Remove to/from personal list
             */
            op.$el.on('click', '.save', function () {
                if (this.checked) {
                    $(this).next().text('Remove from personal list');
                    var eventHtml = $(this).closest('.day-event').html();
                    var eventMonth = $(this).closest('.day-event').attr('date-month');
                    var eventDay = $(this).closest('.day-event').attr('date-day');
                    var eventNumber = $(this).closest('.day-event').attr('data-number');
                    $('.person-list').append('<div class="day" date-month="' + eventMonth + '" date-day="' + eventDay + '" data-number="' + eventNumber + '" style="display:none;">' + eventHtml + '</div>');
                    $('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"]').slideDown('fast');
                    $('.day').find('.close').remove();
                    $('.day').find('.save').removeClass('save').addClass('remove');
                    $('.day').find('.remove').next().addClass('hidden-print');
                    remove();
                    sortlist();
                } else {
                    $(this).next().text('Save to personal list');
                    var eventMonth = $(this).closest('.day-event').attr('date-month');
                    var eventDay = $(this).closest('.day-event').attr('date-day');
                    var eventNumber = $(this).closest('.day-event').attr('data-number');
                    $('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').slideUp('slow');
                    setTimeout(function () {
                        $('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').remove();
                    }, 1500);
                }
            });

            /**
             * Print button
             */
            op.$el.on('click', '.print-btn', function () {
                window.print();
            });


            //methods.myMethod.apply(this, [args]); // how to accessing a public method

        });
    };


    /*
     * public method 
     * call outside by: $(element).pluginName('method', args... )
     * call inside by: methods.myMethod.apply(this, [args]); 
     */
    methods.myMethod = function (args) {
        var op = this[pluginName]; // get instance 

        // code here

        // get/set data instance
        // var op = $(this).data(pluginName);
        // if any change inside $(this).data(pluginName, op);	
    };

    var privateMethod = function (args) {

    };

    $.fn[pluginName] = function (m) {
        if (methods[m]) {
            return methods[m].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof m === 'object' || !m)
            return methods.init.apply(this, arguments);
        else
            $.error(pluginName + ' Method ' + m + ' fail ');
    };

})(jQuery);

