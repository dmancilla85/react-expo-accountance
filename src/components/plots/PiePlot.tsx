type PiePlotProps = {
  data: any[];
};

function PiePlot({ data }: PiePlotProps) {
  console.debug(data);
  return <div>PiePlot</div>;
}

export default PiePlot;
