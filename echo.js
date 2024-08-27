class OracoEcho {
    /** @param {string} formId ID of the target form */
    constructor(formId) {
        this.form = document.getElementById(formId);
        
        this.initialize();
        this.echoAll();
    }

    initialize() {
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
        const target = document.getElementById(source.getAttribute('data-echo-target'));

        if(source.hasAttribute('data-echo-wrapper-template')){

            let template = document.getElementById(source.getAttribute('data-echo-wrapper-template')).content.cloneNode(true);
            
            template = template.firstElementChild.outerHTML;
            template = template.replace(/{{value}}/g, value);
            target.innerHTML = template;

        }else if(source.hasAttribute('data-echo-wrapper')){
            wrapper = source.getAttribute('data-echo-wrapper');
            
            target.innerHTML = wrapper ? wrapper.replace('{{value}}', value) : value;
        }else{
            target.innerHTML = value;
        }

    }

    /** @param {Event} event  */
    echo(event) {
        // get the event target
        const source = event.target;

        if(this.validate(source)){
            // echo the target element
            this.echoElement(source);
        }
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
            return false;
        }

        // target ID must exist
        if(document.getElementById(source.getAttribute('data-echo-target')) === null){
            return false;
        }

        // template ID must exist
        if(source.hasAttribute('data-echo-wrapper-template') && document.getElementById(source.getAttribute('data-echo-wrapper-template')) === null){
            return false;
        }

        return true;
    }
}