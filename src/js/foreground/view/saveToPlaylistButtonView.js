﻿define([
    'background/model/user',
    'foreground/view/prompt/saveVideosPromptView',
    'text!template/saveToPlaylistButton.html'
], function (User, SaveVideosPromptView, SaveToPlaylistButtonTemplate) {
    'use strict';

    var SaveToPlaylistButtonView = Backbone.Marionette.ItemView.extend({
        
        tagName: 'button',
        className: 'button-icon colored',
        template: _.template(SaveToPlaylistButtonTemplate),

        events: {
            'click': 'saveToPlaylist',
            'dblclick': 'saveToPlaylist'
        },
        
        onRender: function() {
            this.setTitleAndDisabled();
        },
        
        initialize: function () {
            this.listenTo(User, 'change:signedIn', this.setTitleAndDisabled);
        },

        saveToPlaylist: _.debounce(function () {
            // Return false even on disabled button click so the click event does not bubble up and select the item. 
            if (!this.$el.hasClass('disabled')) {  
                var saveVideosPromptView = new SaveVideosPromptView({
                    videos: [this.model]
                });

                saveVideosPromptView.fadeInAndShow();
            }

            //  Don't allow dblclick to bubble up to the list item and cause a play.
            return false;
        }, 100, true),
        
        setTitleAndDisabled: function () {
           
            var signedIn = User.get('signedIn');

            var title = signedIn ? chrome.i18n.getMessage('save') : chrome.i18n.getMessage('cantSaveNotSignedIn');

            this.$el.attr('title', title).toggleClass('disabled', !signedIn);
        }

    });

    return SaveToPlaylistButtonView;
});