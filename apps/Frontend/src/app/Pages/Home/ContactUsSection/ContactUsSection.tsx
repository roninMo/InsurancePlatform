import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { Input, Icon, defaultBoxMetadataTags, Textarea } from '@Project/ReactComponents';

import styled from '@emotion/styled';
import styles from './ContactUsSection.module.scss';


export const ContactUsSection = () => {
  // LinkedIn, phone, and email information 
  const linkedInProfileLink = 'https://www.linkedin.com/in/kieran-schwegman/';
  const phoneNumber = '+3179082517';
  const displayPhoneNumber = '+1 (317) 908-2517';
  const myEmail = 'schwegmank@gmail.com';
  const defaultSubject = 'What do you need me to do?';
  const body = "";

  // first name
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const updateValue = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    setState: Dispatch<SetStateAction<string>>,
    type: ContactInputTypes
  ) => {
    if (!setState) return;

    const value = e?.target?.value;
    setState(value);
    checkAndValidate(type, value);
  }

  // onSubmit
  const onSubmit = () => {
    const validations: Partial<Record<ContactInputTypes, Validation | null>> = {};
    // Error handling - Hacky until react hook forms
    validations.firstName = checkValidity('firstName', firstName);
    validations.lastName = checkValidity('lastName', lastName);
    validations.email = checkValidity('email', email);
    validations.phone = checkValidity('phone', phone);
    validations.message = checkValidity('message', message);
    setErrors(validations);
    console.log('validations: ', validations);

    // TODO: create email
    const recipient = myEmail;
    const subject = defaultSubject;
    const baseComposeUrl = 'https://mail.google.com/mail/?view=cm&fs=1';
    const gmailLink = `${baseComposeUrl}&to=${recipient}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

    // window.open(gmailLink, '_blank', 'noopener,noreferrer'); // new tab / Safe, NoHTTP Referrer
  }
  
  // #region Quick Validation Errors
  const [errors, setErrors] = useState<Record<string, Validation | null>>({});
  const checkValidity = (type: ContactInputTypes, value: string): Validation | null => {
    let validation: Validation | null = null;
    if (type == 'firstName')  validation = value ? null : { error: true, message: 'First name is required.'}; 
    if (type == 'lastName')   validation = value ? null : { error: true, message: 'Last name is required.'}; 
    if (type == 'email')      validation = value ? null : { error: true, message: 'Email is required.'}; 
    if (type == 'phone')      validation = value ? null : { error: true, message: 'Phone number is required.'}; 
    if (type == 'message')    validation = value ? null : { error: true, message: "Don't forget to type a message!"}; 
    // console.log('CheckValidity: ', type, validation);
    return validation;
  }

  const setError = (error: Validation | null, type: ContactInputTypes) => {
    if (type == 'firstName') setErrors(prevValue => ({...prevValue, firstName: error}));
    if (type == 'lastName') setErrors(prevValue => ({...prevValue, lastName: error}));
    if (type == 'email') setErrors(prevValue => ({...prevValue, email: error}));
    if (type == 'phone') setErrors(prevValue => ({...prevValue, phone: error}));
    if (type == 'message') setErrors(prevValue => ({...prevValue, message: error}));
  }

  const checkAndValidate = (type: ContactInputTypes, value: string) => {
    const validation: Validation | null = checkValidity(type, value);
    setError(validation, type);
  }
  
  //#endregion

  return (
    <div className='spacing bg-div' id='contact-us'>
      <div className='span-12 border-styles border-default border-t mx-10 mt-8' />
      <ContactSection className='span-12 col items-center gap-2 p-4 pt-24'>

        {/* <label className='primary-text text-lg'>Get Started</label> */}

        <h2 className='pb-8 text-4xl lg:text-6xl text-center text-shadow-md'>
          Looking for a developer?
        </h2>

        <p className='py-2 text-base lg:text-xl md:w-7/12 xl:w-5/12 text-center'>
          Sometimes I have trouble making it to the phone, but I'll get back to you shortly if I don't pick up. I'm looking forward to speaking with you!
        </p>

        <ContactOptions className='py-4 flex-1 row justify-center'>
          <div className='col gap-2 *:rowStart *:items-center *:gap-4 *:p-2'>
            <div>
              <Icon variant='Envelope' styles='text-slate-500 dark:text-slate-300 size-6 lg:size-8 hover:theme-focus trans' />
              <a href={`mailto:${encodeURIComponent(myEmail)}?subject=${encodeURIComponent(defaultSubject)}&body=${encodeURIComponent(body)}`} 
                  className='text-base lg:text-lg italic placeholder-text hover:link-text'
              >
                Email me - 
                <span className='text-base lg:text-lg italic primary-text'>&nbsp;{ myEmail }</span>
              </a>
            </div>

            <div>
              <Icon variant='Phone' styles='text-green-600 dark:text-green-500 size-6 lg:size-8 hover:theme-focus trans' />
              <a href={`tel:${phoneNumber}`} 
                  className='text-base lg:text-lg italic placeholder-text hover:link-text'
              >
                Call 
                <span className='text-base lg:text-lg italic label-text'>&nbsp;{ displayPhoneNumber }</span>
              </a>
            </div>

            <div>
              <Icon variant='LinkedIn' styles='text-sky-600 dark:text-sky-600 size-6 lg:size-8 hover:theme-focus trans' />
              <a href={linkedInProfileLink} 
                  className='text-base lg:text-lg italic placeholder-text hover:link-text'
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
        </ContactOptions>

        <FormSection className='spacing gap-4 pt-24 w-full md:w-8/12 2xl:w-6/12'>
          <h2 className='span-12 pb-2 text-2xl lg:text-3xl text-shadow-md'>
            Send me a message
          </h2>

          {/* First Name */}
          <div className='span-12 lg:span-6'>
            <Input 
              type="text"
              label="First Name"
              placeholder="Your first name"
              value={firstName}
              onChange={(e) => updateValue(e, setFirstName, 'firstName')}

              required={false}
              error={errors?.firstName?.error}
              errorMessage={errors?.firstName?.message}

              name="ContactUs-FirstName"
            />
          </div>
          
          {/* Last Name */}
          <div className='span-12 lg:span-6'>
            <Input 
              type="text"
              label="Last Name"
              placeholder="Your last name"
              value={lastName}
              onChange={(e) => updateValue(e, setLastName, 'lastName')}

              required={false}
              error={errors?.lastName?.error}
              errorMessage={errors?.lastName?.message}

              name="ContactUs-LastName"
            />
          </div>

          {/* Email */}
          <div className='span-12 lg:span-6'>
            <Input 
              type="email"
              label="Email"
              placeholder="Your email"
              value={email}
              onChange={(e) => updateValue(e, setEmail, 'email')}

              required={false}
              error={errors?.email?.error}
              errorMessage={errors?.email?.message}

              name="ContactUs-Email"
            />
          </div>

          {/* Phone Number */}
          <div className='span-12 lg:span-6'>
            <Input 
              type="phone"
              label="Phone Number"
              placeholder="Your phone number"
              value={phone}
              onChange={(e) => updateValue(e, setPhone, 'phone')}

              required={false}
              error={errors?.phone?.error}
              errorMessage={errors?.phone?.message}

              name="ContactUs-Email"
            />
          </div>

          {/* Message */}
          <div className='span-12 pt-4'>
            <Textarea 
              type="box"
              name="ContactUs-Message"
              label="Email to schwegmank@gmail.com"
              value={message}
              onChange={(e) => updateValue(e, setMessage, 'message')}
              placeholder="Enter text here..."
              description="Shoot me a message, I'll get back to you soon"
              // onAttachFile={() => {}}
              metadataTags={defaultBoxMetadataTags}
            
              onSubmit={(e) => onSubmit()}
              submitButtonText="Submit"
              error={errors?.message?.error}
              errorMessage={errors?.message?.message}
            
              // disabled={messageDisabled}
              // required={messageRequired}
            />
          </div>

        </FormSection>
      </ContactSection>
    </div>

  );
}

// Styled Components
const ContactSection = styled.div``;
const ContactOptions = styled.div``;
const FormSection = styled.div``;

type ContactInputTypes = 'firstName' | 'lastName' | 'email' | 'phone' | 'message';
interface Validation {
  error: boolean;
  message?: string;
}