import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import styled from '@emotion/styled';
import { Input, Icon } from '@Project/ReactComponents';
import { defaultBoxMetadataTags, Textarea } from '../../../Components/Forms/Textarea';

import styles from './ContactUsSection.module.scss';


export const ContactUsSection = () => {
  // LinkedIn, phone, and email information 
  const linkedInProfileLink = 'https://www.linkedin.com/in/kieran-schwegman/';
  const phoneNumber = '+3179082517';
  const displayPhoneNumber = '+1 (317) 908-2517';
  const recipient = 'schwegmank@gmail.com';
  const subject = encodeURIComponent('Interested in applying for a potential job?');
  const body = encodeURIComponent('');

  // first name
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const updateValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setState: Dispatch<SetStateAction<string>>) => {
    if (!setState) return;

    const value = e?.target?.value;
    setState(value);
  }

  // onSubmit
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [messageErrorText, setMessageErrorText] = useState<string>("");
  const onSubmit = () => {
    // Error handling
    if (!firstName || !lastName || !email || !message) {
      setSubmitError(true);
      
      // Hacky until react hook forms
      if (!firstName)     setMessageErrorText("First name is required.");
      else if (!lastName) setMessageErrorText("Last name is required.");
      else if (!email)    setMessageErrorText("Email is required.");
      else if (!message)  setMessageErrorText("Don't forget to type a message!");
      return;
    }

    setSubmitError(false);
    setMessageErrorText("");

    // TODO: create email
  }
  

  return (
    <div className='spacing bg-div' id='contact-us'>
      <div className='span-12 border-styles border-default border-t mx-10 mt-8' />
      <ContactSection className='span-12 col items-center gap-2 p-4 pt-24'>

        {/* <label className='primary-text text-lg'>Get Started</label> */}

        <h2 className='pb-8 text-4xl lg:text-6xl text-center text-shadow-md'>
          Looking for a developer?
        </h2>

        <p className='py-2 text-lg lg:text-2xl md:w-8/12 xl:w-6/12 text-center'>
          Sometimes I have trouble making it to the phone, but I'll get back to you shortly if I don't pick up. I'm looking forward to speaking with you!
        </p>

        <ContactOptions className='py-4 flex-1 row justify-center'>
          <div className='col gap-2 *:rowStart *:items-center *:gap-4 *:p-2'>
            <div>
              <Icon variant='Envelope' styles='text-slate-500 dark:text-slate-300 size-6 lg:size-8 hover:theme-focus transition' />
              <a href={`mailto:${recipient}?subject=${subject}&body=${body}`} 
                  className='text-base lg:text-lg italic placeholder-text hover:link-text'
              >
                Email me
              </a>
            </div>

            <div>
              <Icon variant='Phone' styles='text-green-600 dark:text-green-500 size-6 lg:size-8 hover:theme-focus transition' />
              <a href={`tel:${phoneNumber}`} 
                  className='text-base lg:text-lg italic placeholder-text hover:link-text'
              >
                Call {displayPhoneNumber}
              </a>
            </div>

            <div>
              <Icon variant='LinkedIn' styles='text-sky-600 dark:text-sky-600 size-6 lg:size-8 hover:theme-focus transition' />
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
              onChange={(e) => updateValue(e, setFirstName)}

              required={false}
              error={false}
              errorMessage={""}

              id="ContactUs-FirstName"
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
              onChange={(e) => updateValue(e, setLastName)}

              required={false}
              error={false}
              errorMessage={""}

              id="ContactUs-LastName"
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
              onChange={(e) => updateValue(e, setEmail)}

              required={false}
              error={false}
              errorMessage={""}

              id="ContactUs-Email"
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
              onChange={(e) => updateValue(e, setPhone)}

              required={false}
              error={false}
              errorMessage={""}

              id="ContactUs-Email"
              name="ContactUs-Email"
            />
          </div>

          {/* Message */}
          <div className='span-12 pt-4'>
            <Textarea 
              type="box"
              id="ContactUs-Message"
              name="ContactUs-Message"
              label="Email to schwegmank@gmail.com"
              value={message}
              onChange={(e) => updateValue(e, setMessage)}
              placeholder="Enter text here..."
              description="Shoot me a message, I'll get back to you soon"
              // onAttachFile={() => {}}
              metadataTags={defaultBoxMetadataTags}
            
              onSubmit={(e) => onSubmit()}
              submitButtonText="Submit"
              // error={messageError}
              // errorMessage={messageErrorText}
            
              // disabled={messageDisabled}
              // required={messageRequired}
            
              aria=""
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
