/**
 * a default loading screen
 * @memberOf me
 * @ignore
 * @constructor
 */
var LoadingScreen = me.ScreenObject.extend({
    // constructor
    init: function() {
        this.parent(true);

        // flag to know if we need to refresh the display
        this.invalidate = false;

        // handle for the susbcribe function
        this.handle = null;

    },
    /**
     * call when the loader is resetted
     */
    onResetEvent: function() {
        // melonJS logo
        this.logo1 = new me.Font('century gothic', 32, 'white', 'middle');
        this.logo2 = new me.Font('century gothic', 32, '#55aa00', 'middle');
        this.logo2.bold();
        this.logo1.textBaseline = this.logo2.textBaseline = "alphabetic";

        // default progress bar height
        this.barHeight = 4;

        // setup a callback
        this.handle = me.event.subscribe(me.event.LOADER_PROGRESS, this.onProgressUpdate.bind(this));

        // load progress in percent
        this.loadPercent = 0;
    },
    /**
     *  destroy object at end of loading
     */
    onDestroyEvent: function() {
        // "nullify" all fonts
        this.logo1 = this.logo2 = null;
        // cancel the callback
        if (this.handle) {
            me.event.unsubscribe(this.handle);
            this.handle = null;
        }
    },
    /**
     * make sure the screen is refreshed every frame 
     * @param {int} progress progress.
     */
    onProgressUpdate: function(progress) {
        this.loadPercent = progress;
        this.invalidate = true;
    },
    // make sure the screen is refreshed every frame 
    update: function() {
        if (this.invalidate === true) {
            // clear the flag
            this.invalidate = false;
            // and return true
            return true;
        }
        // else return false
        return false;
    },
    // draw function
    draw: function(context) {

        // measure the logo size
        var logo1_width = this.logo1.measureText(context, "melon").width;
        var xpos = (me.video.getWidth() - logo1_width - this.logo2.measureText(context, "JS").width) / 2;
        var ypos = (me.video.getHeight() / 2) + (this.logo2.measureText(context, "melon").height);

        // clear surface
        me.video.clearSurface(context, "#202020");

        // draw the melonJS string
        this.logo1.draw(context, 'SPACE', xpos, ypos);
        xpos += 100;
        this.logo2.draw(context, 'FIGHT', xpos, ypos);

        // display a progressive loading bar
        var progress = Math.floor(this.loadPercent * me.video.getWidth());

        // draw the progress bar
        context.fillStyle = "black";
        context.fillRect(0, (me.video.getHeight() / 2) - (this.barHeight / 2), me.video.getWidth(), this.barHeight);
        context.fillStyle = "#55aa00";
        context.fillRect(2, (me.video.getHeight() / 2) - (this.barHeight / 2), progress, this.barHeight);
    }

});
/*
 * menu screen
 */
var MenuScreen = me.ScreenObject.extend(
        {
            /*
             * constructor
             */
            init: function()
            {
                // call parent constructor
                this.parent(true, true);
                // init stuff
                this.title = null;
                this.play = null;
                this.version = null;
            },
            /*
             * reset function
             */
            onResetEvent: function()
            {
                // add parallax background
                me.game.add(new BackgroundObject(), 1);
                // load title image
                this.title = me.loader.getImage("title");
                // play button
                this.play = new Button("play", me.state.PLAY, 180);
                // version
                this.version = new me.Font("Verdana", 20, "white");
            },
            /*
             * drawing function
             */
            draw: function(context)
            {
                // draw title
                context.drawImage(this.title, (me.video.getWidth() / 2 - this.title.width / 2), 1);
                // draw play button
                this.play.draw(context);
            },
            /*
             * destroy event function
             */
            onDestroyEvent: function()
            {
                // release mouse event
                me.input.releasePointerEvent("mousedown", this.play);
            }
        });
/*
 * play screen
 */
var PlayScreen = me.ScreenObject.extend(
        {
            init: function()
            {
                // call parent constructor
                this.parent(true, true);
                // init stuff
                this.title = null;
                this.play = null;
                this.helptext = new me.Font("Verdana", 10, "white");

            },
            /*
             * action to perform when game starts
             */
            onResetEvent: function()
            {
                me.game.score = 0;
                me.game.showhelp = true;
                // add parallax background
                me.game.add(new BackgroundObject(), 1);
                me.entityPool.add("EnemyEntity", EnemyEntity, true);
                me.entityPool.add("ImplosionEntity", ImplosionEntity, true);
                me.game.add(new EnemyFleet(), 10);
                me.game.add(new Container(), 11);
                me.game.sort();

            },
            /*
             * action to perform when game is finished (state change)
             */
            onDestroyEvent: function()
            {

                var enemys = me.game.getEntityByName("EnemyEntity");
                for (var c = 0; c < enemys.length; c++) {
                    if (me.device.touch) {
                        me.input.releasePointerEvent("touchmove", enemys[c]);
                        me.input.releasePointerEvent("touchstart", enemys[c]);
                    } else {
                        me.input.releasePointerEvent("click", enemys[c]);
                    }
                    me.game.remove(enemys[c]);
                }
            },
            /*
             * drawing function
             */
            draw: function(context)
            {
                if (me.game.showhelp) {
                    var versionText = "TOUCH THE ALIENS FOR DESTROY";
                    this.helptext.draw(context, versionText, me.video.getWidth() / 3, me.video.getHeight() / 2);
                }
            },
            update: function() {
                this.parent();

                var enemys = me.game.getEntityByName("EnemyEntity");
                for (var c = 0; c < enemys.length; c++) {
                    if (enemys[c].pos.x <= -40) {
                        me.game.remove(enemys[c], true);
                    }
                }
                return true;
            }
        });
/*
 * game over screen
 */
var GameOverScreen = me.ScreenObject.extend(
        {
            /*
             * constructor
             */
            init: function()
            {
                // call parent constructor
                this.parent(true, true);
                // init stuff
                this.end = null;
                this.score = null;
                this.restart = null;
                this.menu = null;
                this.finalScore = null;
                this.strScore = "";
            },
            /*
             * reset function
             */
            onResetEvent: function(score)
            {
                if (me.device.localStorage) {
                    if (localStorage.score !== undefined) {
                        this.finalScore = localStorage.score;
                        if (this.finalScore === "null") {
                            this.finalScore = 0;
                        }
                    } else {
                        this.finalScore = 0;
                    }
                    if (parseInt(me.game.score) > parseInt(this.finalScore)) {
                        this.finalScore = me.game.score;
                    }
                    localStorage.score = this.finalScore;
                }

                // add parallax background
                me.game.add(new BackgroundObject(), 1);
                // labels
                this.end = new me.Font("Verdana", 25, "white");
                this.score = new me.Font("Verdana", 22, "white");
                // buttons
                this.restart = new Button("play", me.state.PLAY, 180);
            }
            ,
            /*
             * drawing function
             */
            draw: function(context)
            {
                this.restart.draw(context);
                var scoreText = "YOUR SCORE: " + me.game.score + " \n";
                scoreText += "BEST SCORE : " + this.finalScore;
                var scoreSize = this.score.measureText(context, scoreText);
                this.score.draw(context, scoreText, me.video.getWidth() / 2 - scoreSize.width / 2, 100);
            }
            ,
            /*
             * destroy event function
             */
            onDestroyEvent: function()
            {
                // release mouse event
                me.input.releasePointerEvent("mousedown", this.restart);
                me.input.releasePointerEvent("mousedown", this.menu);
            }
        });
var ScoreScreen = me.ScreenObject.extend(
        {
            init: function() {
                this.parent(true);
            },
            /*
             * action to perform when game starts
             */
            onResetEvent: function()
            {
                this.font = new me.Font("Verdana", 20, "white");
                me.game.add(new BackgroundObject(), 1);
                this.play = new Button("play", me.state.PLAY, 180);

            },
            /*
             * action to perform when game is finished (state change)
             */
            onDestroyEvent: function()
            {
            }
            , draw: function(context) {
                this.font.draw(context, "Your score: " + me.game.score, me.video.getWidth() / 2.9, me.video.getHeight() / 2.8);
                this.play.draw(context);
            }

        });
var SettingsScreen = me.ScreenObject.extend(
        {
            /*
             * action to perform when game starts
             */
            onResetEvent: function()
            {
                // add parallax background
                me.game.add(new BackgroundObject(), 1);
            },
            /*
             * action to perform when game is finished (state change)
             */
            onDestroyEvent: function()
            {
            }

        });
var CreditsScreen = me.ScreenObject.extend(
        {
            /*
             * action to perform when game starts
             */
            onResetEvent: function()
            {
                // add parallax background
                me.game.add(new BackgroundObject(), 1);
            },
            /*
             * action to perform when game is finished (state change)
             */
            onDestroyEvent: function()
            {

            }

        });

        