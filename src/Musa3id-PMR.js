/* 
 * Musa3id: A gadget to assist various user actions on arabic wikipedia. a fork of Adiutor (Author: Vikipolimer).
 * Author: وهراني (Wahrani)
 * licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) and GNU Free Documentation License (GFDL). 
 * Module: Page move requests
 */
/* <nowiki> */
$.when(mw.loader.using(["mediawiki.user", "oojs-ui-core", "oojs-ui-windows", ]), $.ready).then(function() {
	var mwConfig = mw.config.get(["wgAction", "wgPageName", "wgTitle", "wgUserGroups", "wgUserName", "wgCanonicalNamespace", "wgNamespaceNumber"]);
	api = new mw.Api();

	function PageMoveRequestDialog(config) {
		PageMoveRequestDialog.super.call(this, config);
	}
	OO.inheritClass(PageMoveRequestDialog, OO.ui.ProcessDialog);
	PageMoveRequestDialog.static.name = 'PageMoveRequestDialog';
	PageMoveRequestDialog.static.title = 'Musa3id (Beta) - طلب نقل صفحة';
	PageMoveRequestDialog.static.actions = [{
		action: 'save',
		label: 'تأكيد',
		flags: ['primary', 'progressive']
	}, {
		label: 'إلغاء',
		flags: 'safe'
	}];
	PageMoveRequestDialog.prototype.initialize = function() {
		PageMoveRequestDialog.super.prototype.initialize.apply(this, arguments);
		var headerTitle = new OO.ui.MessageWidget({
			type: 'notice',
			inline: true,
			label: new OO.ui.HtmlSnippet('<strong>طلبات نقل الصفحات</strong><br><small>تُستخدم هذه الأداة لطلبات نقل الصفحات إلى صفحة أخرى. في الحالات العادية، يمكن  إجراء عمليات نقل الصفحات باستخدام علامة التبويب [نقل] أعلى الصفحات.</small>')
		});
		var RequestRationale = new OO.ui.FieldsetLayout({
			label: 'مضمون الطلب',
		});
		RequestRationale.addItems([
			new OO.ui.FieldLayout(NewPageName = new OO.ui.TextInputWidget({
				value: '',
				indicator: 'required',
			}), {
				label: 'الاسم الجديد',
				help: 'إعادة تسمية الصفحة التي تريد نقلها'
			}),
			new OO.ui.FieldLayout(rationaleInput = new OO.ui.MultilineTextInputWidget({
				placeholder: 'سبب طلب نقل الصفحة.',
				value: '',
				indicator: 'required',
			}), {
				label: 'السبب',
				align: 'inline',
			}),
		]);
		this.content = new OO.ui.PanelLayout({
			padded: true,
			expanded: false
		});
		this.content.$element.append(headerTitle.$element, '<br><hr><br>', RequestRationale.$element, '<br>', rationaleInput.$element);
		this.$body.append(this.content.$element);
	};
	PageMoveRequestDialog.prototype.getActionProcess = function(action) {
		var dialog = this; 
		if(action) {
			return new OO.ui.Process(function() {
				createRequest(NewPageName, rationaleInput);
				dialog.close({
					action: action
				});
			});
		}
		return PageMoveRequestDialog.super.prototype.getActionProcess.call(this, action);
	};
	var windowManager = new OO.ui.WindowManager();
	$(document.body).append(windowManager.$element);
	var dialog = new PageMoveRequestDialog();
	windowManager.addWindows([dialog]);
	windowManager.openWindow(dialog);

	function createRequest(NewPageName, rationaleInput) {
		api.postWithToken('csrf', {
			action: 'edit',
			title: 'ويكيبيديا:طلبات النقل/الحالية',
			appendtext: "\n" + '{{نسخ:طلب النقل| التوقيع = --~~~~' +
				"\n| من =" + mwConfig.wgPageName.replace(/_/g, " ") + 
				"\n| إلى =" + NewPageName.value + 
				"\n| السبب =" + rationaleInput.value +
				"\n| العنوان النهائي = \n\}\}\n",
			summary: '[[وب:طن|طلبات النقل]] الصفحات',
			//tags: 'Musa3id',
			format: 'json'
		}).done(function() {
			window.location = '/wiki/ويكيبيديا:طلبات_النقل';
		});
	}
});
/* </nowiki> */