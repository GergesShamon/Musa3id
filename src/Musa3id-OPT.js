/* 
 * Musa3id: A gadget to assist various user actions on arabic wikipedia. a fork of Adiutor (Author: Vikipolimer).
 * Author: وهراني (Wahrani)
 * licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) and GNU Free Documentation License (GFDL). 
 * Module: Musa3id options
 */
/* <nowiki> */
$.when(mw.loader.using(["mediawiki.user", "oojs-ui-core", "oojs-ui-windows", ]), $.ready).then(function() {
    var mwConfig = mw.config.get(["wgAction", "wgPageName", "wgTitle", "wgUserGroups", "wgUserName", "wgCanonicalNamespace", "wgNamespaceNumber"]);
    var api = new mw.Api();
    var prdSendMessageToCreator = localStorage.getItem("prdSendMessageToCreator") == "true";

    function Musa3idOptionsDialog(config) {
        Musa3idOptionsDialog.super.call(this, config);
    }
    OO.inheritClass(Musa3idOptionsDialog, OO.ui.ProcessDialog);
    Musa3idOptionsDialog.static.name = 'Musa3idOptionsDialog';
    Musa3idOptionsDialog.static.title = 'Musa3id - التفضيلات';
    Musa3idOptionsDialog.static.actions = [{
        action: 'حفظ',
        label: 'التحديث',
        flags: ['primary', 'progressive']
    }, {
        label: 'إلغاء',
        flags: 'safe'
    }];
    Musa3idOptionsDialog.prototype.initialize = function() {
        Musa3idOptionsDialog.super.prototype.initialize.apply(this, arguments);
        this.content = new OO.ui.PanelLayout({
			padded: true,
			expanded: false
        });
        Musa3idSettings = new OO.ui.FieldsetLayout({
			label: 'التفضيلات',
        });
        Musa3idSettings.addItems([
			csdSendMessageToCreator = new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
			    selected: localStorage.getItem("csdSendMessageToCreator") == "true"
			}), {
			    align: 'inline',
			    label: 'تنبيه منشئ الصفحة في حال ترشيح لحذف سريع.',
			    help: 'Explanation'
			}),
			afdSendMessageToCreator = new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
			    selected: localStorage.getItem("afdSendMessageToCreator") == "true"
			}), {
			    align: 'inline',
			    label: 'تنبيه منشئ الصفحة في حال ترشيح لحذف.',
			    help: 'Explanation'
			}),
			prdSendMessageToCreator = new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
			    selected: localStorage.getItem("prdSendMessageToCreator") == "true"
			}), {
			    align: 'inline',
			    label: 'نبه منشئ طلب الحذف.',
			    help: 'Explanation'
			}),
			csdLogNominatedPages = new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
			    selected: localStorage.getItem("csdLogNominatedPages") == "true"
			}), {
			    align: 'inline',
			    label: 'سجل طلبات الحذف',
			    help: 'Explanation'
			}),
			csdLogPageName = new OO.ui.FieldLayout(new OO.ui.TextInputWidget({
			    value: localStorage.getItem("csdLogPageName"),
			}), {
			    label: 'اسم سجل طلبات الحذف السريع',
			    help: 'Explanation'
			}),
			afdLogNominatedPages = new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
			    selected: localStorage.getItem("afdLogNominatedPages") == "true"
			}), {
			    align: 'inline',
			    label: 'الاحتفاظ بسجل  للصفحات التي وسمتها للحذف السريع',
			    help: 'Explanation'
			}),
			afdLogPageName = new OO.ui.FieldLayout(new OO.ui.TextInputWidget({
			    value: localStorage.getItem("afdLogPageName")
			}), {
			    label: 'اسم سجل وسوم الحذف',
			    help: 'Explanation'
			}),
			prdLogNominatedPages = new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
			    selected: localStorage.getItem("prdLogNominatedPages") == "true"
			}), {
			    align: 'inline',
			    label: 'الاحتفاظ بسجل  للصفحات التي قدمت طلبا لحذفها',
			    help: 'Explanation'
			}),
			prdLogPageName = new OO.ui.FieldLayout(new OO.ui.TextInputWidget({
			    value: localStorage.getItem("prdLogPageName"),
			}), {
			    label: 'اسم سجل طلبات الحذف',
			    help: 'Explanation'
			}),			
			afdNominateOpinionsLog = new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
			    selected: localStorage.getItem("afdNominateOpinionsLog") == "true"
			}), {
			    align: 'inline',
			    label: 'سجل تعليقاتي على AFD',
			    help: 'Explanation'
			}),
			afdOpinionLogPageName = new OO.ui.FieldLayout(new OO.ui.TextInputWidget({
			    value: localStorage.getItem("afdOpinionLogPageName"),
			}), {
			    label: 'اسم سجل تعليقاتي على AFD',
			    help: 'Explanation'
			}),
			showMyStatus = new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
			    selected: localStorage.getItem("showMyStatus") == "true"
			}), {
			    align: 'inline',
			    label: 'عرض حالة نشاط المستخدمين',
			    help: 'عندما تنشط هذا الخيار، فسيمكنك مطالعة حالة نشاط المستخدم على صفحته.'
			}),
        ]);
        this.content.$element.append(Musa3idSettings.$element);
        this.$body.append(this.content.$element);
    };
    Musa3idOptionsDialog.prototype.getActionProcess = function(action) {
        var dialog = this;
        if (action) {
			return new OO.ui.Process(function() {
			    UpdatedOptions = JSON.stringify([{
					"name": "csdSendMessageToCreator",
					"value": csdSendMessageToCreator.fieldWidget.selected
			    }, {
					"name": "csdLogNominatedPages",
					"value": csdLogNominatedPages.fieldWidget.selected
			    }, {
					"name": "csdLogPageName",
					"value": csdLogPageName.fieldWidget.value
			    }, {
					"name": "afdSendMessageToCreator",
					"value": afdSendMessageToCreator.fieldWidget.selected
			    }, {
					"name": "afdLogNominatedPages",
					"value": afdLogNominatedPages.fieldWidget.selected
			    }, {
					"name": "afdLogPageName",
					"value": afdLogPageName.fieldWidget.value
			    }, {
					"name": "prdSendMessageToCreator",
					"value": prdSendMessageToCreator.fieldWidget.selected
			    }, {
					"name": "prdLogNominatedPages",
					"value": prdLogNominatedPages.fieldWidget.selected
			    }, {
					"name": "prdLogPageName",
					"value": prdLogPageName.fieldWidget.value
			    }, {
					"name": "afdNominateOpinionsLog",
					"value": afdNominateOpinionsLog.fieldWidget.selected
			    }, {
					"name": "afdOpinionLogPageName",
					"value": afdOpinionLogPageName.fieldWidget.value
			    }, {
					"name": "showMyStatus",
					"value": showMyStatus.fieldWidget.selected
			    }, {
					"name": "MyStatus",
					"value": "active"
			    }]);
			    updateOptions(UpdatedOptions);
			    dialog.close({
					action: action
			    });
			});
        }
        return Musa3idOptionsDialog.super.prototype.getActionProcess.call(this, action);
    };
    var windowManager = new OO.ui.WindowManager();
    $(document.body).append(windowManager.$element);
    var dialog = new Musa3idOptionsDialog();
    windowManager.addWindows([dialog]);
    windowManager.openWindow(dialog);

    function updateOptions(UpdatedOptions) {
        api.postWithToken('csrf', {
			action: 'edit',
			title: 'User:' + mwConfig.wgUserName + '/Musa3id-options.js',
			text: UpdatedOptions,
			tags: 'Musa3id',
			summary: '[[WP:Musa3id|Musa3id]] user settings has been updated',
			format: 'json'
        }).done(function() {
			var Notification = new OO.ui.MessageWidget({
			    type: 'success',
			    label: 'تم حفظ تفضيلاتك لاستعمال Musa3id بنجاح.',
			    classes: ['afd-helper-notification'],
			    showClose: true
			});
			$('.mw-page-container-inner').append(Notification.$element);
			setTimeout(function() {
			    $(".afd-helper-notification").hide('blind', {}, 500);
			}, 5000);
        });
    }
});
/* </nowiki> */