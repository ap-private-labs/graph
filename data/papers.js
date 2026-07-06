window.GRAPH_DATA = {
papers: [
  {
    id: "light-field-rendering",
    title: "Light Field Rendering",
    year: 1996,
    venue: "SIGGRAPH",
    authors: ["Marc Levoy", "Pat Hanrahan"],
    area: "Image-based rendering",
    citationBand: "3k+",
    url: "https://graphics.stanford.edu/papers/light/",
    contribution:
      "Established light fields as a practical representation for synthesizing new views from dense image samples."
  },
  {
    id: "lumigraph",
    title: "The Lumigraph",
    year: 1996,
    venue: "SIGGRAPH",
    authors: ["Steven J. Gortler", "Radek Grzeszczuk", "Richard Szeliski", "Michael F. Cohen"],
    area: "Image-based rendering",
    citationBand: "1k+",
    url: "https://www.microsoft.com/en-us/research/publication/the-lumigraph/",
    contribution:
      "Introduced a closely related 4D light-field style representation with geometric support for view interpolation."
  },
  {
    id: "photo-tourism",
    title: "Photo Tourism: Exploring Photo Collections in 3D",
    year: 2006,
    venue: "SIGGRAPH",
    authors: ["Noah Snavely", "Steven M. Seitz", "Richard Szeliski"],
    area: "Internet photo collections",
    citationBand: "5k+",
    url: "https://www.cs.cornell.edu/~snavely/publications/photo_tourism/",
    contribution:
      "Showed how unordered photo collections can be registered into navigable 3D scenes, a data setting later revisited by NeRF-W."
  },
  {
    id: "colmap",
    title: "Structure-from-Motion Revisited",
    year: 2016,
    venue: "CVPR",
    authors: ["Johannes L. Schonberger", "Jan-Michael Frahm"],
    area: "Camera geometry",
    citationBand: "3k+",
    url: "https://openaccess.thecvf.com/content_cvpr_2016/html/Schonberger_Structure-From-Motion_Revisited_CVPR_2016_paper.html",
    contribution:
      "Made robust sparse reconstruction and camera pose estimation broadly usable through COLMAP-style SfM pipelines."
  },
  {
    id: "occupancy-networks",
    title: "Occupancy Networks: Learning 3D Reconstruction in Function Space",
    year: 2019,
    venue: "CVPR",
    authors: ["Lars Mescheder", "Michael Oechsle", "Michael Niemeyer", "Sebastian Nowozin", "Andreas Geiger"],
    area: "Implicit geometry",
    citationBand: "2k+",
    url: "https://arxiv.org/abs/1812.03828",
    contribution:
      "Represented 3D shape as a continuous neural occupancy field, helping establish implicit functions for geometry."
  },
  {
    id: "deepsdf",
    title: "DeepSDF: Learning Continuous Signed Distance Functions for Shape Representation",
    year: 2019,
    venue: "CVPR",
    authors: ["Jeong Joon Park", "Peter Florence", "Julian Straub", "Richard Newcombe", "Steven Lovegrove"],
    area: "Implicit geometry",
    citationBand: "2k+",
    url: "https://arxiv.org/abs/1901.05103",
    contribution:
      "Popularized continuous signed-distance neural fields for compact shape representation, interpolation, and completion."
  },
  {
    id: "srn",
    title: "Scene Representation Networks",
    year: 2019,
    venue: "NeurIPS",
    authors: ["Vincent Sitzmann", "Michael Zollhofer", "Gordon Wetzstein"],
    area: "Neural scene fields",
    citationBand: "900+",
    url: "https://arxiv.org/abs/1906.01618",
    contribution:
      "Learned continuous 3D scene functions from posed images with differentiable ray marching, directly foreshadowing NeRF."
  },
  {
    id: "neural-volumes",
    title: "Neural Volumes: Learning Dynamic Renderable Volumes from Images",
    year: 2019,
    venue: "SIGGRAPH",
    authors: ["Stephen Lombardi", "Tomas Simon", "Jason Saragih", "Gabriel Schwartz", "Andreas Lehrmann", "Yaser Sheikh"],
    area: "Neural rendering",
    citationBand: "700+",
    url: "https://arxiv.org/abs/1906.07751",
    contribution:
      "Combined learned volumetric scene representations with differentiable rendering for dynamic view synthesis."
  },
  {
    id: "fourier-features",
    title: "Fourier Features Let Networks Learn High Frequency Functions in Low Dimensional Domains",
    year: 2020,
    venue: "NeurIPS",
    authors: ["Matthew Tancik", "Pratul P. Srinivasan", "Ben Mildenhall", "Sara Fridovich-Keil", "Nithin Raghavan", "Utkarsh Singhal", "Ravi Ramamoorthi", "Jonathan T. Barron", "Ren Ng"],
    area: "Coordinate networks",
    citationBand: "2k+",
    url: "https://arxiv.org/abs/2006.10739",
    contribution:
      "Explained why Fourier feature encodings help coordinate MLPs represent high-frequency image and geometry signals."
  },
  {
    id: "nerf",
    title: "NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis",
    year: 2020,
    venue: "ECCV",
    authors: ["Ben Mildenhall", "Pratul P. Srinivasan", "Matthew Tancik", "Jonathan T. Barron", "Ravi Ramamoorthi", "Ren Ng"],
    area: "Neural radiance fields",
    citationBand: "20k+",
    url: "https://arxiv.org/abs/2003.08934",
    contribution:
      "Defined scenes as continuous 5D radiance and density fields optimized with differentiable volume rendering from posed images."
  },
  {
    id: "nerf-w",
    title: "NeRF in the Wild: Neural Radiance Fields for Unconstrained Photo Collections",
    year: 2021,
    venue: "CVPR",
    authors: ["Ricardo Martin-Brualla", "Noha Radwan", "Mehdi S. M. Sajjadi", "Jonathan T. Barron", "Alexey Dosovitskiy", "Daniel Duckworth"],
    area: "Unconstrained capture",
    citationBand: "1k+",
    url: "https://arxiv.org/abs/2008.02268",
    contribution:
      "Extended NeRF to tourist photos with appearance embeddings and transient components for lighting and occluder variation."
  },
  {
    id: "pixelnerf",
    title: "pixelNeRF: Neural Radiance Fields from One or Few Images",
    year: 2021,
    venue: "CVPR",
    authors: ["Alex Yu", "Vickie Ye", "Matthew Tancik", "Angjoo Kanazawa"],
    area: "Generalizable NeRF",
    citationBand: "900+",
    url: "https://arxiv.org/abs/2012.02190",
    contribution:
      "Conditioned NeRFs on image features so a model could infer scene radiance from one or a few input views."
  },
  {
    id: "mip-nerf",
    title: "Mip-NeRF: A Multiscale Representation for Anti-Aliasing Neural Radiance Fields",
    year: 2021,
    venue: "ICCV",
    authors: ["Jonathan T. Barron", "Ben Mildenhall", "Matthew Tancik", "Peter Hedman", "Ricardo Martin-Brualla", "Pratul P. Srinivasan"],
    area: "Anti-aliasing",
    citationBand: "1k+",
    url: "https://arxiv.org/abs/2103.13415",
    contribution:
      "Replaced infinitesimal rays with conical frustums and integrated positional encodings to reduce NeRF aliasing."
  },
  {
    id: "plenoctrees",
    title: "PlenOctrees for Real-time Rendering of Neural Radiance Fields",
    year: 2021,
    venue: "ICCV",
    authors: ["Alex Yu", "Ruilong Li", "Matthew Tancik", "Hao Li", "Ren Ng", "Angjoo Kanazawa"],
    area: "Real-time rendering",
    citationBand: "600+",
    url: "https://arxiv.org/abs/2103.14024",
    contribution:
      "Baked trained NeRFs into sparse octrees with spherical harmonics, enabling real-time rendering."
  },
  {
    id: "kilonerf",
    title: "KiloNeRF: Speeding up Neural Radiance Fields with Thousands of Tiny MLPs",
    year: 2021,
    venue: "ICCV",
    authors: ["Christian Reiser", "Songyou Peng", "Yiyi Liao", "Andreas Geiger"],
    area: "Real-time rendering",
    citationBand: "300+",
    url: "https://arxiv.org/abs/2103.13744",
    contribution:
      "Partitioned a scene into many small neural fields to accelerate NeRF inference while preserving neural representation."
  },
  {
    id: "plenoxels",
    title: "Plenoxels: Radiance Fields without Neural Networks",
    year: 2022,
    venue: "CVPR",
    authors: ["Sara Fridovich-Keil", "Alex Yu", "Matthew Tancik", "Qinhong Chen", "Benjamin Recht", "Angjoo Kanazawa"],
    area: "Explicit radiance fields",
    citationBand: "800+",
    url: "https://arxiv.org/abs/2112.05131",
    contribution:
      "Showed that sparse voxel grids with spherical harmonics can match NeRF-style quality without an MLP."
  },
  {
    id: "instant-ngp",
    title: "Instant Neural Graphics Primitives with a Multiresolution Hash Encoding",
    year: 2022,
    venue: "SIGGRAPH",
    authors: ["Thomas Muller", "Alex Evans", "Christoph Schied", "Alexander Keller"],
    area: "Acceleration",
    citationBand: "3k+",
    url: "https://arxiv.org/abs/2201.05989",
    contribution:
      "Used multiresolution hash grids and fused CUDA kernels to train high-quality neural graphics primitives in seconds."
  },
  {
    id: "mip-nerf-360",
    title: "Mip-NeRF 360: Unbounded Anti-Aliased Neural Radiance Fields",
    year: 2022,
    venue: "CVPR",
    authors: ["Jonathan T. Barron", "Ben Mildenhall", "Dor Verbin", "Pratul P. Srinivasan", "Peter Hedman"],
    area: "Unbounded scenes",
    citationBand: "1k+",
    url: "https://arxiv.org/abs/2111.12077",
    contribution:
      "Adapted mip-NeRF to full 360-degree unbounded captures with scene contraction and distortion regularization."
  },
  {
    id: "tensorf",
    title: "TensoRF: Tensorial Radiance Fields",
    year: 2022,
    venue: "ECCV",
    authors: ["Anpei Chen", "Zexiang Xu", "Andreas Geiger", "Jingyi Yu", "Hao Su"],
    area: "Compact explicit fields",
    citationBand: "700+",
    url: "https://arxiv.org/abs/2203.09517",
    contribution:
      "Factorized radiance fields into compact tensor components, improving reconstruction speed and memory efficiency."
  },
  {
    id: "gaussian-splatting",
    title: "3D Gaussian Splatting for Real-Time Radiance Field Rendering",
    year: 2023,
    venue: "SIGGRAPH",
    authors: ["Bernhard Kerbl", "Georgios Kopanas", "Thomas Leimkuhler", "George Drettakis"],
    area: "Explicit radiance fields",
    citationBand: "4k+",
    url: "https://arxiv.org/abs/2308.04079",
    contribution:
      "Replaced dense neural sampling with optimized anisotropic 3D Gaussians and a fast differentiable rasterizer."
  }
],

edges: [
  {
    source: "light-field-rendering",
    target: "nerf",
    relation: "cited for image-based view synthesis and radiance/light-field foundations"
  },
  {
    source: "lumigraph",
    target: "nerf",
    relation: "cited as a classical light-field view-synthesis baseline"
  },
  {
    source: "photo-tourism",
    target: "nerf-w",
    relation: "cited for unordered tourist photo collections and internet-scale reconstruction"
  },
  {
    source: "photo-tourism",
    target: "mip-nerf-360",
    relation: "cited as part of the lineage of real-world 360-degree scene capture"
  },
  {
    source: "colmap",
    target: "nerf",
    relation: "cited for estimating camera poses from real captured images"
  },
  {
    source: "colmap",
    target: "nerf-w",
    relation: "cited for registering unconstrained photo collections"
  },
  {
    source: "colmap",
    target: "mip-nerf-360",
    relation: "cited for sparse reconstruction and camera calibration"
  },
  {
    source: "colmap",
    target: "gaussian-splatting",
    relation: "cited for initializing scenes from SfM points and camera poses"
  },
  {
    source: "occupancy-networks",
    target: "nerf",
    relation: "cited as a neural implicit 3D representation"
  },
  {
    source: "deepsdf",
    target: "nerf",
    relation: "cited as a continuous implicit shape representation"
  },
  {
    source: "srn",
    target: "nerf",
    relation: "cited for differentiable rendering of continuous neural scenes"
  },
  {
    source: "neural-volumes",
    target: "nerf",
    relation: "cited for learned volumetric scene representations"
  },
  {
    source: "fourier-features",
    target: "mip-nerf",
    relation: "cited for understanding positional encodings in coordinate MLPs"
  },
  {
    source: "fourier-features",
    target: "instant-ngp",
    relation: "cited for high-frequency coordinate encodings"
  },
  {
    source: "nerf",
    target: "nerf-w",
    relation: "extended to uncontrolled lighting, appearance, and transient objects"
  },
  {
    source: "nerf",
    target: "pixelnerf",
    relation: "extended from per-scene optimization to feature-conditioned generalization"
  },
  {
    source: "nerf",
    target: "mip-nerf",
    relation: "extended with multiscale sampling and integrated positional encoding"
  },
  {
    source: "nerf",
    target: "plenoctrees",
    relation: "converted into an explicit octree representation for real-time rendering"
  },
  {
    source: "nerf",
    target: "kilonerf",
    relation: "accelerated with many tiny spatially partitioned MLPs"
  },
  {
    source: "nerf",
    target: "plenoxels",
    relation: "reinterpreted as optimization of an explicit radiance field"
  },
  {
    source: "nerf",
    target: "instant-ngp",
    relation: "accelerated with hash-grid encodings and fully fused GPU kernels"
  },
  {
    source: "nerf",
    target: "mip-nerf-360",
    relation: "extended to anti-aliased unbounded 360-degree captures"
  },
  {
    source: "nerf",
    target: "tensorf",
    relation: "compressed into tensor-factorized explicit radiance fields"
  },
  {
    source: "nerf",
    target: "gaussian-splatting",
    relation: "used as the core radiance-field problem setting and quality baseline"
  },
  {
    source: "nerf-w",
    target: "mip-nerf-360",
    relation: "cited for real-world capture effects and appearance variation"
  },
  {
    source: "mip-nerf",
    target: "mip-nerf-360",
    relation: "generalized to unbounded scenes and 360-degree trajectories"
  },
  {
    source: "mip-nerf",
    target: "gaussian-splatting",
    relation: "cited as a high-quality anti-aliased NeRF baseline"
  },
  {
    source: "plenoctrees",
    target: "plenoxels",
    relation: "cited for sparse explicit radiance-field rendering"
  },
  {
    source: "plenoxels",
    target: "gaussian-splatting",
    relation: "cited for direct optimization of explicit radiance-field parameters"
  },
  {
    source: "instant-ngp",
    target: "tensorf",
    relation: "cited as a fast neural graphics primitive baseline"
  },
  {
    source: "instant-ngp",
    target: "gaussian-splatting",
    relation: "cited as a fast training and rendering baseline"
  },
  {
    source: "mip-nerf-360",
    target: "gaussian-splatting",
    relation: "cited as a state-of-the-art unbounded-scene baseline"
  },
  {
    source: "tensorf",
    target: "gaussian-splatting",
    relation: "cited as an efficient explicit radiance-field baseline"
  }
],

sources: [
  {
    label: "NeRF arXiv",
    url: "https://arxiv.org/abs/2003.08934"
  },
  {
    label: "Mip-NeRF arXiv",
    url: "https://arxiv.org/abs/2103.13415"
  },
  {
    label: "PlenOctrees arXiv",
    url: "https://arxiv.org/abs/2103.14024"
  },
  {
    label: "Instant-NGP arXiv",
    url: "https://arxiv.org/abs/2201.05989"
  },
  {
    label: "3D Gaussian Splatting arXiv",
    url: "https://arxiv.org/abs/2308.04079"
  },
  {
    label: "Neural radiance field overview",
    url: "https://en.wikipedia.org/wiki/Neural_radiance_field"
  },
  {
    label: "Neural field overview",
    url: "https://en.wikipedia.org/wiki/Neural_field"
  }
]
};
