const validateRequest = function(request) {
  let status: boolean = true;
  let messages: Array<String> = [];

  if (!request.chasms.organizationId) {
    status = false;
    messages.push('An organizationId value is required');
  }

  if (!request.chasms.channelId) {
    status = false;
    messages.push('A channelId value is required');
  }

  if (!request.chasms.body) {
    status = false;
    messages.push('A body value is required');
  }

  if (!request.chasms.requestType) {
    status = false;
    messages.push('A requestType value is required');
  }

  if (!request.chasms.authorType) {
    status = false;
    messages.push('An authorType value is required');
  }

  if (!request.chasms.authorId) {
    status = false;
    messages.push('An authorId value is required');
  }

  return { status, messages };
};

export default validateRequest;
