import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AdminSession,
  AdminUserCommand,
} from '../../_components/_index';

export default function AdminCommands() {
  return (
    <AdminSession>
      <Accordion
        className='w-full max-w max-w-[75%] lg:max-w-[50%]'
        type='multiple'
      >
        <AccordionItem className='data-[state=open]:border-b-0' value='item-1'>
          <AccordionTrigger>User Commands</AccordionTrigger>
          <AccordionContent>
            <Accordion type='multiple'>
              <AccordionItem className='border-t' value='item-1'>
                <AccordionTrigger>Create a new User</AccordionTrigger>
                <AccordionContent>
                  <AdminUserCommand actionType='create' />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-2'>
                <AccordionTrigger>Remove a existing User</AccordionTrigger>
                <AccordionContent>
                  <AdminUserCommand actionType='remove' />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-3'>
                <AccordionTrigger>
                  Get a User&apos;s details by Email
                </AccordionTrigger>
                <AccordionContent>
                  <AdminUserCommand actionType='getByEmail' />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-4'>
                <AccordionTrigger>
                  Get a User&apos;s details by ID
                </AccordionTrigger>
                <AccordionContent>
                  <AdminUserCommand actionType='getById' />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-5'>
                <AccordionTrigger>
                  Get all existing User&apos;s details
                </AccordionTrigger>
                <AccordionContent>
                  <AdminUserCommand actionType='getAll' />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-6'>
                <AccordionTrigger>Edit a User&apos;s details</AccordionTrigger>
                <AccordionContent>
                  <AdminUserCommand actionType='edit' />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AdminSession>
  );
}
