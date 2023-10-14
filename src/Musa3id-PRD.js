/* 
 * Musa3id: A gadget to assist various user actions on arabic wikipedia. a fork of Adiutor (Author: Vikipolimer).
 * Author: وهراني (Wahrani)
 * licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) and GNU Free Documentation License (GFDL).
 * Module: Proposed deletion
 */
/* <nowiki> */
$.when(mw.loader.using(["mediawiki.user", "oojs-ui-core", "oojs-ui-windows", ]), $.ready).then(function() {
    var mwConfig = mw.config.get(["wgAction", "wgPageName", "wgTitle", "wgUserGroups", "wgUserName", "wgCanonicalNamespace", "wgNamespaceNumber"]);
    var api = new mw.Api();
    var prdSendMessageToCreator = localStorage.getItem("prdSendMessageToCreator") == "true";
    var PRDText, PRDSummary;

    function ProposedDeletionDialog(config) {
        ProposedDeletionDialog.super.call(this, config);
    }
    OO.inheritClass(ProposedDeletionDialog, OO.ui.ProcessDialog);
    ProposedDeletionDialog.static.name = 'ProposedDeletionDialog';
    ProposedDeletionDialog.static.title = 'Musa3id (Beta) - اقتراح الحذف (PROD)';
    ProposedDeletionDialog.static.actions = [{
        action: 'save',
        label: 'تنفيذ',
        flags: ['primary', 'progressive']
    }, {
        label: 'إلغاء',
        flags: 'safe'
    }];
    ProposedDeletionDialog.prototype.initialize = function() {
        ProposedDeletionDialog.super.prototype.initialize.apply(this, arguments);
        var headerTitle = new OO.ui.MessageWidget({
            type: 'notice',
            inline: true,
            label: new OO.ui.HtmlSnippet('<strong>اقتراح الحذف (PROD)</strong><br><small>PROD اقتراح الحذف هو طلب حذف مقالة غير خلافي، فيعمل به عن انتفاء الحاجة إلى نقاش للحذف وعدم تحقق معايير الحذف السريع. </small>')
        });
        ProposeOptions = new OO.ui.FieldsetLayout({
            label: 'الأنواع'
        });
        ProposeOptions.addItems([
            new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                selected: false,
                value: 'standardPropose'
            }), {
                label: 'PROD (اقتراح الحذف)',
                help: 'اقتراح الحذف وفق لسياسة [[ويكيبيديا:اقتراح الحذف]]',
                align: 'inline'
            }),
            new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                selected: false,
                value: 'LivingPersonPropose'
            }), {
                label: 'BLP PROD (حذف سيرة أحياء بلا مصادر)',
                help: 'اقتراح حذف مقالة جديدة لسيرة أحياء بلا مصادر وفق سياسة [[ويكيبيديا:سير الأحياء]]',
                align: 'inline'
            }), rationaleField = new OO.ui.FieldLayout(rationaleInput = new OO.ui.MultilineTextInputWidget({
                placeholder: 'سبب اقتراح الحذف',
                indicator: 'required',
                value: '',
            }), {
                label: 'السبب',
                align: 'inline',
            }),
            new OO.ui.FieldLayout(new OO.ui.ToggleSwitchWidget({
                value: prdSendMessageToCreator,
                data: 'informCreator'
            }), {
                label: 'نبه منشئ المقالة',
                align: 'top',
                help: 'إذا فعلت، يوضع قالب تنبيه في صفحة نقاش منشئ المقالة.',
            })
        ]);
        rationaleInput.on('change', function() {
            if (rationaleInput.value != "") {
                InputFilled = false;
            } else {
                InputFilled = true;
            }
        });
        this.content = new OO.ui.PanelLayout({
            padded: true,
            expanded: false
        });
        this.content.$element.append(headerTitle.$element, '<br><hr><br>', ProposeOptions.$element);
        this.$body.append(this.content.$element);
    };
    ProposedDeletionDialog.prototype.getActionProcess = function(action) {
        var dialog = this;
        if (action) {
            return new OO.ui.Process(function() {
                var date = new Date();
                var Months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر","ديسمبر"];

                var PRDoptions = [];
                ProposeOptions.items.forEach(function(Option) {
                    if (Option.fieldWidget.selected) {
                        PRDoptions.push({
                            value: Option.fieldWidget.value,
                            selected: Option.fieldWidget.selected
                        });
                    }
                    if (Option.fieldWidget.value === true) {
                        PRDoptions.push({
                            value: Option.fieldWidget.value,
                            data: Option.fieldWidget.data
                        });
                    }
                });
                PRDoptions.forEach(function(Option) {
                    if (Option.value === "standardPropose") {
                        PRDText = '{{Proposed deletion/dated |concern = ' + rationaleInput.value + ' |timestamp = ' + new Date().valueOf() + ' |nom = ' + mwConfig.wgUserName + ' |help = off }}';
                        PRDSummary = 'اقتراح الحذف وفق لسياسة [[ويكيبيديا:اقتراح الحذف]]';
                    }
                    if (Option.value === "LivingPersonPropose") {
                        PRDText = '{{حذف سيرة/مؤرخ| concern = | user = | timestamp = ' + new Date().valueOf() + ' | help = off }}';
                        PRDText = '{{subst:Proposed deletion notify|Living person biography with no references.|help=close}}';
                        PRDSummary = 'اقتراح الحذف وفق لسياسة [[WP:BLPPROD]]';
                    }
                    if (Option.data === "informCreator") {
                        getCreator().then(function(data) {
                            var Author = data.query.pages[mw.config.get('wgArticleId')].revisions[0].user;
                            if (!mw.util.isIPAddress(Author)) {
                                var message = '{{subst:Proposed deletion notify|' + mwConfig.wgPageName.replace(/_/g, " ") + '|concern=' + rationaleInput.value + '|nowelcome=yes}}';
                                sendMessageToAuthor(Author, message);
                            }
                        });
                    }
                });
                putPRDTemplate(PRDText);
                dialog.close({
                    action: action
                });
            });
        }
        return ProposedDeletionDialog.super.prototype.getActionProcess.call(this, action);
    };
    var windowManager = new OO.ui.WindowManager();
    $(document.body).append(windowManager.$element);
    var dialog = new ProposedDeletionDialog();
    windowManager.addWindows([dialog]);
    windowManager.openWindow(dialog);

    function putPRDTemplate(PRDText) {
        api.postWithToken('csrf', {
            action: 'edit',
            title: mwConfig.wgPageName,
            prependtext: "\n"+PRDText + "\n",
            summary: PRDSummary,
            tags: 'Musa3id',
            format: 'json'
        }).done(function() {
            location.reload();
        });
    }

    function getCreator() {
        return api.get({
            action: 'query',
            prop: 'revisions',
            rvlimit: 1,
            rvprop: ['user'],
            rvdir: 'newer',
            titles: mwConfig.wgPageName
        });
    }

    function sendMessageToAuthor(Author, message) {
        api.postWithToken('csrf', {
            action: 'edit',
            title: 'User_talk:' + Author,
            appendtext: '\n' + message+'\n--~~~~',
            summary: 'تنبيه: اقتراح حذف  [[' + mwConfig.wgPageName.replace(/_/g, " ") + ']].',
            tags: 'Musa3id',
            format: 'json'
        });
    }
});
/* </nowiki> */