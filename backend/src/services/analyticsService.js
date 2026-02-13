const counters = {
  totalRequests: 0,
  mediaUploadsRequested: 0,
  searchRequests: 0
};

function increment(metric) {
  if (!Object.prototype.hasOwnProperty.call(counters, metric)) return;
  counters[metric] += 1;
}

function getSummary() {
  return { ...counters, generatedAt: new Date().toISOString() };
}

module.exports = { increment, getSummary };
