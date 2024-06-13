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
        className='min-w-[90%] sm:min-w-[75%] lg:min-w-[900px]'
        type='multiple'
      >
        <AccordionItem className='data-[state=open]:border-b-0' value='item-1'>
          <AccordionTrigger className='[&[data-state=open]]:pb-4'>
            User Commands
          </AccordionTrigger>
          <AccordionContent>
            <Accordion type='multiple'>
              <AccordionItem className='border-t' value='item-1'>
                <AccordionTrigger>Create a new User</AccordionTrigger>
                <AccordionContent>
                  <AdminUserCommand actionType='create' />
                </AccordionContent>
                <AccordionItem value='item-2'>
                  <AccordionTrigger>
                    Edit a User&apos;s details
                  </AccordionTrigger>
                  <AccordionContent>
                    <AdminUserCommand actionType='edit' />
                  </AccordionContent>
                </AccordionItem>
              </AccordionItem>
              <AccordionItem value='item-3'>
                <AccordionTrigger>Remove a existing User</AccordionTrigger>
                <AccordionContent>
                  <AdminUserCommand actionType='remove' />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-4'>
                <AccordionTrigger>
                  Get a User&apos;s details by Email
                </AccordionTrigger>
                <AccordionContent>
                  <AdminUserCommand actionType='getByEmail' />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-5'>
                <AccordionTrigger>
                  Get a User&apos;s details by ID
                </AccordionTrigger>
                <AccordionContent>
                  <AdminUserCommand actionType='getById' />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-6'>
                <AccordionTrigger>
                  Get all existing User&apos;s details
                </AccordionTrigger>
                <AccordionContent>
                  <AdminUserCommand actionType='getAll' />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AdminSession>
  );
}
