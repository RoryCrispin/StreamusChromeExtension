﻿//  This view is intended to house all of the player controls (play, pause, etc) as well as the StreamView
define([
    'background/collection/streamItems',
    'background/model/player',
    'background/model/buttons/nextButton',
    'background/model/buttons/playPauseButton',
    'background/model/buttons/previousButton',
    'common/enum/playerState',
    'foreground/view/rightBasePane/streamView',
    'foreground/view/rightBasePane/timeProgressView',
    'foreground/view/rightBasePane/volumeView',
    'text!template/rightBasePane.html'
], function (StreamItems, Player, NextButton, PlayPauseButton, PreviousButton, PlayerState, StreamView, TimeProgressView, VolumeView, RightBasePaneTemplate) {
    'use strict';

    var RightBasePaneView = Backbone.Marionette.Layout.extend({

        className: 'right-base-pane',

        template: _.template(RightBasePaneTemplate),
        
        regions: {
            stream: '#stream-region',
            timeProgress: '#time-progress-region',
            volume: '#volume-region'
        },
        
        events: {
            'click @ui.nextButton': 'tryActivateNextVideo',
            'click @ui.previousButton': 'tryDoTimeBasedPrevious',
            'click @ui.playPauseButton': 'tryTogglePlayerState'
        },
        
        modelEvents: {
            'change:state': 'setPlayPauseButtonState'
        },
        
        ui: {
            nextButton: '#next-button',
            previousButton: '#previous-button',
            playPauseButton: '#play-pause-button'
        },
        
        onShow: function () {
            this.stream.show(new StreamView({
                collection: StreamItems
            }));

            this.timeProgress.show(new TimeProgressView({
                model: this.model
            }));

            this.volume.show(new VolumeView({
                model: this.model
            }));
            
            this.applyTooltips();
        },

        onRender: function () {
            this.setPlayPauseButtonState();
            this.setNextButtonDisabled();
            this.setPreviousButtonDisabled();
        },
        
        initialize: function () {
            this.listenTo(NextButton, 'change:enabled', this.setNextButtonDisabled);
            this.listenTo(PreviousButton, 'change:enabled', this.setPreviousButtonDisabled);
            this.listenTo(PlayPauseButton, 'change:enabled', this.setPlayPauseButtonState);
        },
        
        tryActivateNextVideo: function () {
            //  Model is persistent to allow for easy rule validation when using keyboard shortcuts to control.
            NextButton.tryActivateNextVideo();
        },
        
        tryDoTimeBasedPrevious: function() {
            PreviousButton.tryDoTimeBasedPrevious();
        },
        
        tryTogglePlayerState: function () {
            PlayPauseButton.tryTogglePlayerState();
        },
        
        setNextButtonDisabled: function () {
            this.ui.nextButton.toggleClass('disabled', !NextButton.get('enabled'));
        },
        
        setPreviousButtonDisabled: function() {
            this.ui.previousButton.toggleClass('disabled', !PreviousButton.get('enabled'));
        },
        
        setPlayPauseButtonState: function() {
            var playerState = this.model.get('state');
            
            var icon;
            switch(playerState) {
                case PlayerState.Buffering:
                    icon = $('<div>', { 'class': 'spinner spinner-small' });
                    break;
                case PlayerState.Playing:
                    icon = $('<i>', { 'class': 'fa fa-lg fa-pause' });
                    break;
                default:
                    icon = $('<i>', { 'class': 'fa fa-lg fa-play' });
            }

            this.ui.playPauseButton.empty().append(icon);
            this.ui.playPauseButton.toggleClass('disabled', !PlayPauseButton.get('enabled'));
        }

    });

    return RightBasePaneView;
});