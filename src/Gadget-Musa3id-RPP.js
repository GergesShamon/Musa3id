/* 
 * Musa3id: A gadget to assist various user actions on arabic wikipedia. a fork of Adiutor (Author: Vikipolimer).
 * Author: وهراني (Wahrani)
 * licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) and GNU Free Documentation License (GFDL). 
 * Module: Requests for page protection
/* <nowiki> */
$.when(mw.loader.using(["mediawiki.user", "oojs-ui-core", "oojs-ui-windows", ]), $.ready).then(function() {
    var mwConfig = mw.config.get(["wgAction", "wgPageName", "wgTitle", "wgUserGroups", "wgUserName", "wgCanonicalNamespace", "wgNamespaceNumber"]);
    var RPPText, RPPSummary;

    function PageProtectionDialog(config) {
        PageProtectionDialog.super.call(this, config);
    }
    OO.inheritClass(PageProtectionDialog, OO.ui.ProcessDialog);
    PageProtectionDialog.static.name = 'PageProtectionDialog';
    PageProtectionDialog.static.title = 'Musa3id (Beta) - RPP';
    PageProtectionDialog.static.actions = [{
        action: 'save',
        label: 'استحداث طلب',
        flags: ['primary', 'progressive']
    }, {
        label: 'إلغاء',
        flags: 'safe'
    }];
    PageProtectionDialog.prototype.initialize = function() {
        PageProtectionDialog.super.prototype.initialize.apply(this, arguments);
        var headerTitle = new OO.ui.MessageWidget({
            type: 'notice',
            inline: true,
            label: new OO.ui.HtmlSnippet('<strong>طلب حماية صفحة</strong><br><small>يمكنك طلب حماية هذه الصفحة. راجع أولا سياسة الحماية.</small>')
        });
        TypeOfAction = new OO.ui.FieldsetLayout({
            label: 'نوع الحماية'
        });
        TypeOfAction.addItems([
            new OO.ui.DropdownWidget({
                menu: {
                    items: [
                        new OO.ui.MenuSectionOptionWidget({
                            label: 'حماية تامة'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "1",
                            label: 'عادية (تامة)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "2",
                            label: 'Content dispute/edit warring (تامة)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "3",
                            label: 'تخريب متكرر (تامة)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "4",
                            label: 'صفحة نقاش مستخدم ممنوع (تامة)'
                        }),/*
                        //Extended confirmed protection
                        new OO.ui.MenuSectionOptionWidget({
                            label: 'Extended confirmed protection'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "1",
                            label: 'Arbitration enforcement (ECP)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "2",
                            label: 'Persistent vandalism (ECP)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "3",
                            label: 'Disruptive editing (ECP)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "4",
                            label: 'BLP policy violations (ECP)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "4",
                            label: 'Sockpuppetry (ECP)'
                        }),*/
                        //Semi-protection
                        new OO.ui.MenuSectionOptionWidget({
                            label: 'نصف حماية'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "1",
                            label: 'عامة (نصف)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "2",
                            label: 'تخريب متكرر (نصف)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "3",
                            label: 'Disruptive editing (نصف)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "4",
                            label: 'إضافة محتوى بلا مصادر (نصف)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "4",
                            label: 'BLP policy violations (نصف)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "4",
                            label: 'مستخدم دمية (نصف)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "4",
                            label: 'User talk of blocked user (نصف)'
                        }),
                        //Pending changes
                        new OO.ui.MenuSectionOptionWidget({
                            label: 'تغييرات معلقة (ت م)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "1",
                            label: 'عامة  (ت م)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "2",
                            label: 'تخريب متكرر (ت م)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "3",
                            label: 'تعديل مختلف حوله (ت م)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "4",
                            label: 'إضافة محتوى بلا مصادر (ت م)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "4",
                            label: 'BLP policy violations (ت م)'
                        }),
                        //Move protection
                        new OO.ui.MenuSectionOptionWidget({
                            label: 'حماية من النقل'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "1",
                            label: 'عام (نقل)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "2",
                            label: 'Dispute/move warring (نقل)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "3",
                            label: 'نقل مخرب (move)'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: "4",
                            label: 'Highly visible page (نقل)'
                        }),
                    ]
                },
                label: "اختر نوع الحماية"
            }),

            DurationOfProtection = new OO.ui.DropdownWidget({
                menu: {
                    items: [
                        new OO.ui.MenuOptionWidget({
                            data: 1,
                            label: 'مؤقتة'
                        }),
                        new OO.ui.MenuOptionWidget({
                            data: 2,
                            label: 'دائمة'
                        }),
                    ]
                },
                label: "المدة"
            }),

            rationaleField = new OO.ui.FieldLayout(rationaleInput = new OO.ui.MultilineTextInputWidget({
                placeholder: 'سبب الحماية:',
                indicator: 'required',
                value: '',
            }), {
                label: 'السبب',
                align: 'inline',
            }),
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
        this.content.$element.append(headerTitle.$element, '<br><hr><br>', TypeOfAction.$element);
        this.$body.append(this.content.$element);
    };
    PageProtectionDialog.prototype.getActionProcess = function(action) {
        var dialog = this;
        if (action) {
            return new OO.ui.Process(function() {
                RPPText = "{{نسخ:طلب حماية صفحة|توقيع=--~~~~"
                     +"\n|صفحة=" + mwConfig.wgPageName.replace(/_/g, " ")
                     +"\n|سبب =" + rationaleInput.value + "\n}}";
                RPPSummary = 'طلب حماية المقالة [[' + mwConfig.wgPageName.replace(/_/g, " ") + ']]';
                addProtectionRequests(RPPText);
                dialog.close({
                    action: action
                });
            });
        }
        return PageProtectionDialog.super.prototype.getActionProcess.call(this, action);
    };
    var windowManager = new OO.ui.WindowManager();
    $(document.body).append(windowManager.$element);
    var dialog = new PageProtectionDialog();
    windowManager.addWindows([dialog]);
    windowManager.openWindow(dialog);

    function addProtectionRequests(RPPText) {
        api.postWithToken('csrf', {
            action: 'edit',
            title: 'ويكيبيديا:إخطار الإداريين/حماية/الحالية',
            appendtext: "\n"+ RPPText + "\n",
            summary: RPPSummary,
            //tags: 'Musa3id',
            format: 'json'
        }).done(function() {
            mw.notify('تم العملية بنجاح. انتظر قليلا.',{ autoHide: false});
            window.location = '/wiki/ويكيبيديا:إخطار الإداريين/حماية/الحالية';
        });
    }
});
/* </nowiki> */
