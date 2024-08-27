class OracoEcho {
    /** @param {string} formId ID of the target form */
    constructor(formId) {
        this.form = document.getElementById(formId);
        
        this.initialize();
        this.echoAll();
    }

    initialize() {
        if (this.form == null) {
            console.error('Form not found');
            return;
        }
        // Attach the event listener to the form
        this.form.addEventListener('input', this.echo.bind(this));
    }

    /** @param {HTMLInputElement} source */
    getValue(source) {
        switch (source.type) {
            case 'text':
            case 'password':
            case 'email':
            case 'url':
            case 'tel':
            case 'search':
            case 'number':
            case 'range':
            case 'color':
            case 'date':
            case 'datetime-local':
            case 'month':
            case 'week':
            case 'time':
            case 'select-one':
            case 'radio':
            case 'textarea':
                return source.value;
            case 'checkbox':
                return source.checked ? true : false;
            case 'select-multiple':
                const selectedValues = [];
                for (const option of source.options) {
                    if (option.selected) {
                        selectedValues.push(option.value);
                    }
                }
                return selectedValues.join(', '); 
            default:
                return '';
        }
    }

    /** @param {HTMLInputElement} source */
    echoElement(source) {
        const value = this.getValue(source);

        if (value === '' || value == null) {
            console.error(`Value is empty for ${source.id}`);
            return;
        }

        const echoAttribute = source.getAttribute('data-echo-attribute');

        if (echoAttribute == null) {
            console.error('data-echo-attribute is missing');
            return;
        }

        const target = document.getElementById(echoAttribute);

        if (target == null) {
            console.error('Target not found');
            return;
        }

            template = template.firstElementChild.outerHTML;
            template = template.replace(/{{value}}/g, value);
            target.innerHTML = template;

        }else if(source.hasAttribute('data-echo-wrapper')){
            wrapper = source.getAttribute('data-echo-wrapper');
            
            target.innerHTML = wrapper ? wrapper.replace('{{value}}', value) : value;
        }else{
            target.innerHTML = value;
        }
            if (wrapper == null) {
                console.error('data-echo-wrapper is missing');
                return;
            }

    }

    /** @param {Event} event  */
    echo(event) {
        // get the event target
        const source = event.target;

        if (source == null) {
            console.error('Event target not found');
            return;
        }

        if (source instanceof HTMLInputElement == false) {
            console.error('Event target is not an input element');
            return;
        }

        if (this.validate(source)) {
            // echo the target element
            this.echoElement(source);
        }
    }

    echoAll() {
        const form = this.form;

        if (form == null) {
            console.error('Form not found');
            return;
        }

        // get all the inputs from the parent container
        const inputs = /** @type {NodeListOf<HTMLInputElement>} */ (
            form.querySelectorAll(
                'input[data-echo-target], select[data-echo-target], textarea[data-echo-target]',
            )
        );

        // filter inputs by it's value and disable attributes
        inputs.forEach(source => {
            if(this.validate(source, true)){
                this.echoElement(source);
            }
        });
    }

    /**
     * @param {HTMLInputElement} source
     * @param {boolean} [echoAll=false] [TODO:description]
     * @returns {boolean}
     */
    validate(source, echoAll = false) {
        // extra rules if echoAll is triggered
        if(echoAll){
            // input must NOT have data-echo-disable-autofill
            if(source.hasAttribute('data-echo-disable-autofill')){
                return false;
            }

            // the value must NOT be empty
            if(!this.getValue(source)){
                return false;
            }
        }

        // input must NOT have data-echo-disable
        if(source.hasAttribute('data-echo-disable')){
            return false;
        }

        // input must have a target
        if(!source.hasAttribute('data-echo-target')){
        const targetId = source.getAttribute('data-echo-target');

        if (targetId == null) {
            console.error('data-echo-target is missing');
            return false;
        }

        // target ID must exist
        if (document.getElementById(targetId) == null) {
            return false;
        }

        const templateId = source.getAttribute('data-echo-wrapper-template');

        if (templateId == null) {
            console.error('data-echo-wrapper-template is missing');
            return false;
        }

        // template ID must exist
        if(source.hasAttribute('data-echo-wrapper-template') && document.getElementById(source.getAttribute('data-echo-wrapper-template')) === null){
            return false;
        }

        return true;
    }
}