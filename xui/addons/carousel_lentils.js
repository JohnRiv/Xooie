define('carousel_lentils', ['jquery', 'addons_base'], function($, Base) {

    var Lentils = Base('lentils', function(){
        var self = this;

        this.lentilBuilders = {
            "item": function(container, template){
                var items = self.module.content.children(),
                    element, i;

                for (i = 0; i < items.length; i += 1) {

                    element = $(template.micro_render({
                        number: i + 1,
                        scroll_mode: "item",
                        lentil_is_last: (i === items.length - 1)
                    }));
                    container.append(element);
                }
            },

            "page": function(container, template){
                if (typeof self.module.addons.pagination === 'undefined') {
                    return;
                }

                var element, i;

                for (i = 0; i < self.module.addons.pagination._breaks.length; i += 1) {
                    element = $(template.micro_render({
                        number: i + 1,
                        scroll_mode: "page",
                        lentil_is_last: (i === self.module.addons.pagination._breaks.length - 1)
                    }));

                    container.append(element);
                }

            }

        };

        this.module.root.addClass('is-carousel-lentiled');

        this.module.root.on('carouselUpdated', function(){
            self.updateLentils();
        });

        this.module.root.on('carouselScrollComplete', function(){
            self.currentLentil();
        });

        this.updateLentils();

        this.currentLentil();

    });

    Lentils.setDefaultOptions({
        lentilMode: 'item',
        lentilSelector: '[data-role="carousel-lentils"]',
        lentilTemplateSelector: '[data-role="carousel-lentils-template"]',

        activeLentilClass: 'is-active-lentil'
    });

    Lentils.prototype.currentLentil = function(){
        var container = this.module.root.find(this.options.lentilSelector),
            lentils = container.children(),
            index;

        if (this.options.lentilMode === 'page' && typeof this.module.addons.pagination !== 'undefined') {
            index = this.module.addons.pagination.currentPage();
        } else {
            index = this.module.currentItem();
        }

        lentils.filter('.' + this.options.activeLentilClass).removeClass(this.options.activeLentilClass);

        lentils.eq(index).addClass(this.options.activeLentilClass);
    };

    Lentils.prototype.updateLentils = function() {
        var container = this.module.root.find(this.options.lentilSelector),
            template = this.module.root.find(this.options.lentilTemplateSelector),
            self = this;

        if (container.length > 0 && template.length > 0) {
            container.html('');

            if (typeof this.lentilBuilders[this.options.lentilMode] === 'function') {
                this.lentilBuilders[this.options.lentilMode](container, template);

                container.children().on('click', function(event) {
                    event.preventDefault();
                    self.module.updatePosition($(this).data('scroll'));
                });

                this.currentLentil();

            }
        }
    };

    return Lentils;
});
