export default function Results({ results }) {
    return (
      <div>
        <h2>Biomarker Predictions</h2>
        <div>
          {Object.entries(results).map(([group, biomarkers]) => (
            <div key={group}>
              <h3>{group}</h3>
              <ul>
                {Object.entries(biomarkers).map(([name, value]) => (
                  <li key={name}>{name}: {value}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }
  