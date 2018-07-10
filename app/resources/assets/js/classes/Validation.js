$(() => {
	function appendError(input, form, object) {
		let error

		try {
			if (typeof JSON.parse(input.attr('data-error')) === 'object') {
				error = JSON.parse(input.attr('data-error'))[object]
			}
		} catch (e) {
			error = input.attr('data-error')
		}

		input
			.parents('.form-group, .form-check')
			.addClass('has-error')
			.find('.input-error')
			.html(error)

		form
			.addClass('has-errors')
			.find('.submit-form')
			.prop('disabled', true)
	}

	// input validation
	function validateInput(input, form) {
		let regexp = RegExp('^[a-zA-Z0-9+\\.+\\-\\_]+@([a-zA-Z0-9]+\\.)+[a-zA-Z]+$')

		input
			.parents('.form-group, .form-check')
			.removeClass('has-error')
			.find('.input-error')
			.html('')

		form.removeClass('success')

		if (!form.find('.form-group, .form-check').hasClass('has-error')) {
			form
				.removeClass('has-errors')
				.find('.submit-form')
				.prop('disabled', false)
		}

		if (input.is('[required]')) {
			switch (input.attr('type')) {
				case 'email':
					if (!input.val()) {
						appendError(input, form, 'required')
					} else if (!regexp.test(input.val())) {
						appendError(input, form, 'invalid')
					}

					break
				case 'checkbox':
					if (!input.is(':checked')) {
						appendError(input, form)
					}

					break
				case 'radio':
					if (!form.find('input[name="' + input.attr('name') + '"]:checked').length) {
						appendError(input, form)
					}

					break
				default:
					if (!input.val()) {
						appendError(input, form, 'required')
					}
			}
		}
	}

	// scroll to form top
	function scrollForm(position) {
		let windowTop = $(window).scrollTop()

		if (windowTop > position) {
			$('html, body').animate({ 'scrollTop': position })
		}
	}

	// scroll to error
	function scrollToFirstError(form) {
		let $errorField = form.find('.has-error')

		if ($errorField.length) {
			let errorTop = $errorField.first().offset().top - 10

			scrollForm(errorTop)
		}
	}

	// validate input on focus out
	$('form.validate').on('focusout', 'input, textarea, select', (e) => {
		let self = $(e.currentTarget)

		if (self.val().length) {
			validateInput(self, self.parents('form'))
		}
	})

	// validate input on change
	$('form.validate').on('change', 'input, textarea, select', (e) => {
		let self = $(e.currentTarget)

		validateInput(self, self.parents('form'))
	})

	// validate input on keyup
	$('form.validate').on('keyup', 'input, textarea, select', (e) => {
		let self = $(e.currentTarget)

		if (self.parents('.form-group').hasClass('has-error')) {
			validateInput(self, self.parents('form'))
		}
	})

	// submit form
	$('form.validate').on('submit', (e) => {
		e.preventDefault()

		let submitBtn = $(e.currentTarget).find('.submit-form')
		let form = $(e.currentTarget)

		// check if action or method attribute is set
		if (!form.attr('action') || !form.attr('method')) {
			alert('Action and Method attributes must be specified')
			return
		}

		// go through all elements and validate
		$.each(form.find('input, textarea, select'), function (index, item) {
			validateInput($(item), form)
		})

		scrollToFirstError(form)

		if (!form.hasClass('has-errors')) {
			let formData = new FormData(form[0])

			submitBtn
				.addClass('loading')
				.prop('disabled', true)

			axios({
				method: form.attr('method'),
				url: form.attr('action'),
				data: formData
			}).then(res => {
				submitBtn
					.removeClass('loading')
					.prop('disabled', false)

				if (res.status === 200) {
					form.addClass('success')

					let $successAlert = form.find('.form-alert-success')

					if ($successAlert.length && res.data.message) {
						$successAlert.find('.response-message').html(res.data.message)

						scrollForm($successAlert.offset().top - 10)
					}
				}

				if (res.data.redirect) {
					submitBtn.prop('disabled', true)

					setTimeout(() => {
						window.location = res.data.redirect
					}, 1000)
				} else {
					form[0].reset()
				}
			}).catch(err => {
				submitBtn.removeClass('loading')

				$.each(form.find('input, textarea, select'), (e) => {
					let name = $(e.currentTarget).attr('name')

					if (err.response.data.errors[name]) {
						$(e.currentTarget)
							.parents('.form-group, .form-check')
							.addClass('has-error')

						$(e.currentTarget)
							.parents('.form-group, .form-check')
							.find('.input-error')
							.html(err.response.data.errors[name][0])
					}
				})

				scrollToFirstError(form)
			})
		}
	})
})