import ClientForm from "components/ClientForm";

const NewClient = () => {

  return (
    <ClientForm />
  );
};

NewClient.acl = {
  action: "read",
  subject: "street-page"
};

export default NewClient;