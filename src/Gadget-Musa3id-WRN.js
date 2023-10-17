/* 
 * Musa3id: A gadget to assist various user actions on arabic wikipedia. a fork of Adiutor (Author: Vikipolimer).
 * Author: وهراني (Wahrani)
 * licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) and GNU Free Documentation License (GFDL). 
 * Module: User Warning
 */
/* <nowiki> */
$.when(mw.loader.using(["mediawiki.user", "oojs-ui-core", "oojs-ui-windows", ]), $.ready).then(function() {
	var mwConfig = mw.config.get(["wgAction", "wgPageName", "wgTitle", "wgUserGroups", "wgUserName", "wgCanonicalNamespace", "wgNamespaceNumber", "wgRevisionId"]);
	var api = new mw.Api();
	var RequestRationale, warningTemplate;

	function UserWarningDialog(config) {
		UserWarningDialog.super.call(this, config);
	}
	OO.inheritClass(UserWarningDialog, OO.ui.ProcessDialog);
	UserWarningDialog.static.name = 'UserWarningDialog';
	UserWarningDialog.static.title = 'Musa3id (Beta) - تنبيه المستخدم';
	UserWarningDialog.static.actions = [{
		action: 'save',
		label: 'تنفيذ',
		flags: ['primary', 'progressive']
	}, {
		label: 'إلغاء',
		flags: 'safe'
	}];
	UserWarningDialog.prototype.initialize = function() {
		UserWarningDialog.super.prototype.initialize.apply(this, arguments);
		var headerTitle = new OO.ui.MessageWidget({
			type: 'notice',
			inline: true,
			label: new OO.ui.HtmlSnippet('<strong>أنت تقوم حاليًا بتحذير هذا المستخدم، وسيظهر هذا التحذير في صفحة نقاش المستخدم.</strong>')
		});
		var RationaleSelector = new OO.ui.DropdownWidget({
			menu: {
				items: [
    				new OO.ui.MenuOptionWidget({data: 1,label: "الاسترجاع المتكرر"}),
    				new OO.ui.MenuOptionWidget({data: 2,label: "خرق قاعدة الاسترجاعات الثلاث"}),
    				new OO.ui.MenuOptionWidget({data: 3,label: "منع بسبب الاسترجاع"}),
    				new OO.ui.MenuOptionWidget({data: 4,label: "منع اسم غير مقبول"}),
    				new OO.ui.MenuOptionWidget({data: 5,label: "منع بروكسي مفتوح"}),
    				new OO.ui.MenuOptionWidget({data: 8,label: "تخريب"}),
    				new OO.ui.MenuOptionWidget({data: 11,label: "تخريب متكرر"}),
    				new OO.ui.MenuOptionWidget({data: 12,label: "تخريب - تنبيه أخير"}),
    				new OO.ui.MenuOptionWidget({data: 13,label: "تنبيه اسم مخالف"}),
    				new OO.ui.MenuOptionWidget({data: 14,label: "تنبيه ألفاظ تباه"}),
    				new OO.ui.MenuOptionWidget({data: 15,label: "تنبيه أنساب"}),
    				new OO.ui.MenuOptionWidget({data: 16,label: "تنبيه تجربة"}),
    				new OO.ui.MenuOptionWidget({data: 17,label: "تنبيه ترجمة آلية"}),
    				new OO.ui.MenuOptionWidget({data: 18,label: "تنبيه حسابات متعددة"}),
    				new OO.ui.MenuOptionWidget({data: 19,label: "تنبيه خرق حقوق النشر"}),
    				new OO.ui.MenuOptionWidget({data: 20,label: "تنبيه دمية"}),
    				new OO.ui.MenuOptionWidget({data: 21,label: "تنبيه سيرة"}),
    				new OO.ui.MenuOptionWidget({data: 22,label: "تنبيه سيرة غير مقبولة"}),
    				new OO.ui.MenuOptionWidget({data: 23,label: "تنبيه صفحة نقاش"}),
    				new OO.ui.MenuOptionWidget({data: 24,label: "تنبيه صفحة نقاش لصفحة محذوفة"}),
    				new OO.ui.MenuOptionWidget({data: 25,label: "تنبيه صورة"}),
    				new OO.ui.MenuOptionWidget({data: 26,label: "تنبيه كلام بلا معنى"}),
    				new OO.ui.MenuOptionWidget({data: 27,label: "تنبيه كومنز"}),
    				new OO.ui.MenuOptionWidget({data: 28,label: "تنبيه لغة"}),
    				new OO.ui.MenuOptionWidget({data: 29,label: "تنبيه لفظ مسيء"}),
    				new OO.ui.MenuOptionWidget({data: 30,label: "تنبيه معلومات غير صحيحة"}),
    				new OO.ui.MenuOptionWidget({data: 31,label: "تنبيه مقالة مكررة"}),
    				new OO.ui.MenuOptionWidget({data: 32,label: "تنبيه نقاش الصفحة الرئيسية"}),
    				new OO.ui.MenuOptionWidget({data: 33,label: "تنبيه نقاش لا يخص تطوير الموضوع وتحسينه"}),
    				new OO.ui.MenuOptionWidget({data: 35,label: "دعاية وإعلانات"}),
    				new OO.ui.MenuOptionWidget({data: 36,label: "صفحة مستخدم مخالفة"}),
    				new OO.ui.MenuOptionWidget({data: 40,label: "تنبيه تعديلات مصدر"}),
    				new OO.ui.MenuOptionWidget({data: 41,label: "تنبيه مصدر"}),
				]
			},
			label: "نوع التنبيه"
		});
		relatedPageField = new OO.ui.FieldLayout(relatedPage = new OO.ui.TextInputWidget({
				value: ''
			}), {
				label: 'صفحة ذات صلة',
				help: 'الصفحة التي تعديلها تسبب في التحذير'
			}),
			this.content = new OO.ui.PanelLayout({
				padded: true,
				expanded: false
			});
		warningLevel = new OO.ui.RadioSelectInputWidget({
			options: [{
				data: 1,
				label: 'توضيح'
			}, {
				data: 2,
				label: 'تنبيه'
			}, {
				data: 3,
				label: 'تنبيه شديد'
			}, ]
		});
		RationaleSelector.getMenu().on('choose', function(menuOption) {
			switch(menuOption.getData()) {
    				case 1: warningTemplate = "استرجاع"; break;
    				case 2: warningTemplate = "استرجاع 2"; break;
    				case 3: warningTemplate = "استرجاع+منع"; break;
    				case 4: warningTemplate = "اسم مستخدم غير مقبول"; break;
    				case 5: warningTemplate = "بروكسي ممنوع"; break;
    				case 7: warningTemplate = "تنبيه 1"; break;
    				case 8: warningTemplate = "تنبيه 2"; break;
    				case 9: warningTemplate = "تنبيه 2+"; break;
    				case 10: warningTemplate = "تنبيه 2-"; break;
    				case 11: warningTemplate = "تنبيه 3"; break;
    				case 12: warningTemplate = "تنبيه 4"; break;
    				case 13: warningTemplate = "تنبيه اسم مخالف"; break;
    				case 14: warningTemplate = "تنبيه ألفاظ تباه"; break;
    				case 15: warningTemplate = "تنبيه أنساب"; break;
    				case 16: warningTemplate = "تنبيه تجربة"; break;
    				case 17: warningTemplate = "تنبيه ترجمة آلية"; break;
    				case 18: warningTemplate = "تنبيه حسابات متعددة"; break;
    				case 19: warningTemplate = "تنبيه خرق"; break;
    				case 20: warningTemplate = "تنبيه دمية"; break;
    				case 21: warningTemplate = "تنبيه سيرة"; break;
    				case 22: warningTemplate = "تنبيه سيرة غير مقبولة"; break;
    				case 23: warningTemplate = "تنبيه صفحة نقاش"; break;
    				case 24: warningTemplate = "تنبيه صفحة نقاش لصفحة محذوفة"; break;
    				case 25: warningTemplate = "تنبيه صورة"; break;
    				case 26: warningTemplate = "تنبيه كلام بلا معنى"; break;
    				case 27: warningTemplate = "تنبيه كومنز"; break;
    				case 28: warningTemplate = "تنبيه لغة"; break;
    				case 29: warningTemplate = "تنبيه لفظ مسيء"; break;
    				case 30: warningTemplate = "تنبيه معلومات غير صحيحة"; break;
    				case 31: warningTemplate = "تنبيه مقالة مكررة"; break;
    				case 32: warningTemplate = "تنبيه نقاش الصفحة الرئيسية"; break;
    				case 33: warningTemplate = "تنبيه نقاش لا يخص تطوير الموضوع وتحسينه"; break;
    				case 34: warningTemplate = "رفع المنع"; break;
    				case 35: warningTemplate = "سخام"; break;
    				case 36: warningTemplate = "صفحة مستخدم مخالفة"; break;
    				case 37: warningTemplate = "منع"; break;
    				case 38: warningTemplate = "منع جزئي"; break;
    				case 39: warningTemplate = "منع دائم"; break;
    				case 40: warningTemplate = "تنبيه تعديلات مصدر"; break;
    				case 41: warningTemplate = "تنبيه مصدر"; break;
			}
		});
		this.content.$element.append(headerTitle.$element, '<br><hr><br>', RationaleSelector.$element, '<br>', relatedPageField.$element  /*, '<br><hr><br>', warningLevel.$element*/
        );
		this.$body.append(this.content.$element);
	};
	UserWarningDialog.prototype.getActionProcess = function(action) {
		var dialog = this;
		if(action) {
			return new OO.ui.Process(function() {
				warnUser(warningTemplate);
				dialog.close({
					action: action
				});
			});
		}
		return UserWarningDialog.super.prototype.getActionProcess.call(this, action);
	};
	var windowManager = new OO.ui.WindowManager();
	$(document.body).append(windowManager.$element);
	var dialog = new UserWarningDialog();
	windowManager.addWindows([dialog]);
	windowManager.openWindow(dialog);

	function warnUser(warningTemplate) {
		api.postWithEditToken({
			action: 'edit',
			title: 'User talk:' + mwConfig.wgPageName.replace(/_/g, " ").replace('نقاش المستخدم:', '').replace('مستخدم:', '').replace('خاص:مساهمات/', ''),
			appendtext: "\n" /*+ "== تحذير! ==" + "\n" */
                   + "{{subst:" + warningTemplate + "|" + relatedPage.value 
                /* + "|" + warningLevel.getValue() */
                   + "}}\n--~~~~" + "\n",
			summary: 'تنبيه مستخدم',
			tags: 'Musa3id',
			watchlist: 'unwatch',
			format: 'json'
		}).done(function() {
			window.location = '/wiki/' + 'User talk:' + mwConfig.wgPageName.replace(/_/g, " ").replace('نقاش المستخدم:', '').replace('مستخدم:', '').replace('خاص:مساهمات/', '');
		});
	}
});
/* </nowiki> */