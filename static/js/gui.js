var Container = me.ObjectContainer.extend({
    init: function() {
        // call the constructor
        this.parent();

        // persistent across level change
        this.isPersistent = true;

        // non collidable
        this.collidable = false;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at position
        this.addChild(new ScoreItem(1, 300));
    }
});

/** 
 * a basic HUD item to display score
 */
var ScoreItem = me.Renderable.extend({
    /** 
     * constructor
     * @param {int} x coordenate x.
     * @param {y} y coordenae y.
     */
    init: function(x, y) {
        me.game.time = 430;
        // call the parent constructor 
        // (size does not matter here)
        this.parent(new me.Vector2d(x, y), 10, 10);

        // create a font        
        this.font = new me.Font("Verdana", 15, "white");
        this.barHeight = 10;
    },
    /**
     * update function
     */
    update: function() {
        this.parent();
        // we don't draw anything fancy here, so just
        // return true if the score has been updated        
        if (me.timer.getTime() % 10 === 0) {
            me.game.time -= 1;
        }
        if (me.game.time <= 0) {
            me.state.change(me.state.GAMEOVER);
            me.game.remove(this);
        }

        return false;
    },
    /**
     * draw the score
     * @param {object} context context of canvas.
     */
    draw: function(context) {
        this.font.draw(context, "SCORE: " + me.game.score, this.pos.x, this.pos.y);
        this.font.draw(context, "TIME: ", 0, 0);
        // draw the progress bar        
        context.fillStyle = "#55aa00";
        context.fillRect(50, 5, me.game.time, this.barHeight);
    }

});
/*
 * draw a button on screen
 */
var Button = me.Rect.extend(
        {
            /*
             * constructor
             */
            init: function(image, action, y)
            {
                // init stuff
                this.image = me.loader.getImage(image + "_hover");
                this.action = action;
                this.pos = new me.Vector2d((me.video.getWidth() / 2 - this.image.width / 2), y);
                // call parent constructor
                this.parent(this.pos, this.image.width, this.image.height);
                // register mouse event
                if (me.device.touch) {
                    me.input.registerPointerEvent("touchstart", this, this.clicked.bind(this));
                    me.input.registerPointerEvent("touchmove", this, this.clicked.bind(this));
                } else {
                    me.input.registerPointerEvent("click", this, this.clicked.bind(this));
                }


            },
            /*
             * action to perform when a button is clicked
             */
            clicked: function()
            {
                if (me.device.touch) {
                    me.input.releasePointerEvent("touchstart", this, this.clicked.bind(this));
                    me.input.releasePointerEvent("touchmove", this, this.clicked.bind(this));
                } else {
                    me.input.releasePointerEvent("click", this, this.clicked.bind(this));
                }

                // start action                
                me.state.change(this.action);

            },
            /*
             * drawing function
             */
            draw: function(context)
            {
                context.drawImage(this.image, this.pos.x, this.pos.y);
            }
        });
/*
 * background layer
 */
var BackgroundLayer = me.ImageLayer.extend(
        {
            /*
             * constructor
             */
            init: function(image, speed)
            {
                name = image;
                width = 480;
                height = 320;
                z = 1;
                ratio = 1;
                this.speed = speed;
                // call parent constructor
                this.parent(name, width, height, image, z, ratio);
            },
            /*
             * update function
             */
            update: function()
            {
                // recalibrate image position
                if (this.pos.x >= this.imagewidth - 1)
                    this.pos.x = 0;


                return true;
            }

        });
/*
 * parallax background
 */
var BackgroundObject = Object.extend(
        {
            /*
             * constructor
             */
            init: function()
            {
                me.game.add(new BackgroundLayer("bkg1M", 1.5), 2); // layer 2
                me.game.sort();
            },
            /*
             * update function
             */
            update: function()
            {
                return true;
            }
        });