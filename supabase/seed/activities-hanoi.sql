-- Sample activities for Hanoi
-- These are examples to demonstrate the structure

-- Activity 1: Coffee Walk in Old Quarter (Understanding + Connection)
INSERT INTO public.activities (
  slug,
  title_vi,
  title_en,
  description_vi,
  description_en,
  category,
  pillar,
  relationship_type,
  effort_level,
  time_required_minutes,
  location_type,
  city,
  cost_range,
  steps,
  conversation_prompts,
  tips,
  tags,
  is_active
) VALUES (
  'coffee-walk-old-quarter',
  'Dạo phố cổ và uống cà phê',
  'Old Quarter Walk and Coffee',
  'Khám phá Phố Cổ Hà Nội cùng nhau, ghé một quán cà phê vỉa hè và trò chuyện về những điều quan trọng',
  'Explore Hanoi Old Quarter together, stop at a sidewalk coffee shop and talk about what matters',
  'date',
  ARRAY['understanding', 'connection'],
  ARRAY['new', 'long_term'],
  'low',
  120,
  'outdoor',
  ARRAY['hanoi'],
  'budget',
  '[
    {"order": 1, "instruction_vi": "Chọn một buổi chiều hoặc tối mát mẻ để đi dạo", "instruction_en": "Choose a cool afternoon or evening for the walk"},
    {"order": 2, "instruction_vi": "Bắt đầu từ khu vực Hồ Hoàn Kiếm, đi bộ vào các con phố nhỏ", "instruction_en": "Start from Hoan Kiem Lake area, walk into small streets"},
    {"order": 3, "instruction_vi": "Tìm một quán cà phê vỉa hè yên tĩnh, ngồi xuống", "instruction_en": "Find a quiet sidewalk coffee shop, sit down"},
    {"order": 4, "instruction_vi": "Gọi đồ uống yêu thích và bắt đầu trò chuyện", "instruction_en": "Order your favorite drinks and start talking"}
  ]'::jsonb,
  '[
    {"prompt_vi": "Điều gì khiến bạn cảm thấy hạnh phúc nhất trong tuần qua?", "prompt_en": "What made you happiest this past week?"},
    {"prompt_vi": "Nếu có thể làm bất cứ điều gì vào cuối tuần này, bạn muốn làm gì?", "prompt_en": "If you could do anything this weekend, what would it be?"},
    {"prompt_vi": "Kể cho tôi nghe về một người bạn ngưỡng mộ", "prompt_en": "Tell me about someone you admire"}
  ]'::jsonb,
  '{
    "do": ["Tắt thông báo điện thoại", "Lắng nghe chăm chú", "Để ý ngôn ngữ cơ thể của người ấy"],
    "dont": ["Vội vàng trả lời tin nhắn", "Chuyển sang chủ đề khác khi đang nói chuyện sâu", "Lo lắng về im lặng"]
  }'::jsonb,
  '["first_date", "casual", "conversation", "outdoor", "hanoi_classic"]'::jsonb,
  true
);

-- Activity 2: Cook Together at Home (Connection + Appreciation)
INSERT INTO public.activities (
  slug,
  title_vi,
  title_en,
  description_vi,
  description_en,
  category,
  pillar,
  relationship_type,
  effort_level,
  time_required_minutes,
  location_type,
  city,
  cost_range,
  steps,
  conversation_prompts,
  tips,
  tags,
  is_active
) VALUES (
  'cook-together-home',
  'Cùng nấu một món ăn đơn giản',
  'Cook a Simple Meal Together',
  'Chọn một công thức đơn giản và cùng nhau chuẩn bị bữa tối, tận hưởng quá trình hơn là kết quả',
  'Choose a simple recipe and prepare dinner together, enjoy the process more than the result',
  'ritual',
  ARRAY['connection', 'appreciation'],
  ARRAY['new', 'long_term'],
  'medium',
  90,
  'home',
  ARRAY['hanoi', 'hcmc'],
  'budget',
  '[
    {"order": 1, "instruction_vi": "Chọn một món ăn cả hai đều thích (gợi ý: mì xào, cơm rang, hoặc salad)", "instruction_en": "Choose a dish you both like (suggestion: stir-fried noodles, fried rice, or salad)"},
    {"order": 2, "instruction_vi": "Cùng đi chợ hoặc siêu thị mua nguyên liệu", "instruction_en": "Go to the market or supermarket together to buy ingredients"},
    {"order": 3, "instruction_vi": "Phân công nhiệm vụ: một người cắt, một người nấu", "instruction_en": "Divide tasks: one person cuts, one person cooks"},
    {"order": 4, "instruction_vi": "Bật nhạc nhẹ nhàng, trò chuyện trong khi nấu", "instruction_en": "Play soft music, talk while cooking"},
    {"order": 5, "instruction_vi": "Cùng dọn dẹp sau khi ăn", "instruction_en": "Clean up together after eating"}
  ]'::jsonb,
  '[
    {"prompt_vi": "Món ăn nào trong gia đình bạn khiến bạn nhớ nhất?", "prompt_en": "What family dish do you miss the most?"},
    {"prompt_vi": "Kỹ năng nào của tôi trong bếp bạn đánh giá cao nhất?", "prompt_en": "What cooking skill of mine do you appreciate most?"},
    {"prompt_vi": "Chúng ta có thể nấu món này thường xuyên hơn không?", "prompt_en": "Can we cook this more often?"}
  ]'::jsonb,
  '{
    "do": ["Cười đùa khi có sai sót", "Khen ngợi nỗ lực của nhau", "Nếm thử và cho phản hồi tích cực"],
    "dont": ["Chỉ trích cách làm của người khác", "Cố làm hoàn hảo", "Vội vàng"]
  }'::jsonb,
  '["home_activity", "quality_time", "teamwork", "casual"]'::jsonb,
  true
);

-- Activity 3: Gratitude Letter (Appreciation)
INSERT INTO public.activities (
  slug,
  title_vi,
  title_en,
  description_vi,
  description_en,
  category,
  pillar,
  relationship_type,
  effort_level,
  time_required_minutes,
  location_type,
  city,
  cost_range,
  steps,
  conversation_prompts,
  tips,
  tags,
  is_active
) VALUES (
  'gratitude-letter',
  'Viết thư cảm ơn',
  'Write a Gratitude Letter',
  'Viết một bức thư ngắn để bày tỏ sự trân trọng với những điều nhỏ nhặt mà người ấy đã làm',
  'Write a short letter expressing appreciation for the small things they do',
  'conversation',
  ARRAY['appreciation'],
  ARRAY['new', 'long_term'],
  'low',
  30,
  'home',
  ARRAY['hanoi', 'hcmc'],
  'free',
  '[
    {"order": 1, "instruction_vi": "Tìm một nơi yên tĩnh, chuẩn bị giấy bút hoặc mở notes trên điện thoại", "instruction_en": "Find a quiet place, prepare pen and paper or open notes on your phone"},
    {"order": 2, "instruction_vi": "Nghĩ về 3 điều cụ thể người ấy đã làm gần đây khiến bạn cảm động", "instruction_en": "Think of 3 specific things they did recently that touched you"},
    {"order": 3, "instruction_vi": "Viết từng điều một, giải thích tại sao nó quan trọng với bạn", "instruction_en": "Write each one, explaining why it matters to you"},
    {"order": 4, "instruction_vi": "Đọc thư cho người ấy nghe trực tiếp hoặc gửi tin nhắn", "instruction_en": "Read the letter to them directly or send as a message"},
    {"order": 5, "instruction_vi": "Lắng nghe phản hồi của người ấy", "instruction_en": "Listen to their response"}
  ]'::jsonb,
  '[]'::jsonb,
  '{
    "do": ["Cụ thể về hành động và cảm xúc", "Chân thành, không cần hoàn hảo", "Nhấn mạnh tác động tích cực"],
    "dont": ["Viết chung chung kiểu \"cảm ơn vì mọi thứ\"", "Đợi dịp đặc biệt mới viết", "Lo lắng về văn phong"]
  }'::jsonb,
  '["appreciation", "communication", "low_effort", "heartfelt"]'::jsonb,
  true
);

-- Activity 4: Share Childhood Photos (Understanding)
INSERT INTO public.activities (
  slug,
  title_vi,
  title_en,
  description_vi,
  description_en,
  category,
  pillar,
  relationship_type,
  effort_level,
  time_required_minutes,
  location_type,
  city,
  cost_range,
  steps,
  conversation_prompts,
  tips,
  tags,
  is_active
) VALUES (
  'share-childhood-photos',
  'Chia sẻ ảnh tuổi thơ',
  'Share Childhood Photos',
  'Cùng nhau xem ảnh hồi nhỏ và kể những câu chuyện đằng sau mỗi bức ảnh',
  'Look at childhood photos together and share stories behind each picture',
  'conversation',
  ARRAY['understanding'],
  ARRAY['new', 'long_term'],
  'low',
  45,
  'home',
  ARRAY['hanoi', 'hcmc'],
  'free',
  '[
    {"order": 1, "instruction_vi": "Mỗi người chuẩn bị 5-10 bức ảnh hồi nhỏ", "instruction_en": "Each person prepares 5-10 childhood photos"},
    {"order": 2, "instruction_vi": "Tìm một không gian thoải mái, ngồi cạnh nhau", "instruction_en": "Find a comfortable space, sit next to each other"},
    {"order": 3, "instruction_vi": "Lần lượt chia sẻ từng bức ảnh và câu chuyện", "instruction_en": "Take turns sharing each photo and story"},
    {"order": 4, "instruction_vi": "Đặt câu hỏi về những điều bạn tò mò", "instruction_en": "Ask questions about what you''re curious about"},
    {"order": 5, "instruction_vi": "Chia sẻ cảm xúc về những gì vừa nghe", "instruction_en": "Share feelings about what you just heard"}
  ]'::jsonb,
  '[
    {"prompt_vi": "Kỷ niệm tuổi thơ nào bạn nhớ nhất?", "prompt_en": "What childhood memory do you remember most?"},
    {"prompt_vi": "Điều gì ở tuổi thơ bạn đã hình thành con người bạn ngày nay?", "prompt_en": "What from your childhood shaped who you are today?"},
    {"prompt_vi": "Nếu có thể quay lại, bạn có muốn thay đổi điều gì không?", "prompt_en": "If you could go back, would you change anything?"}
  ]'::jsonb,
  '{
    "do": ["Lắng nghe không phán xét", "Cười cùng nhau về những kỷ niệm vui", "Ghi nhớ những chi tiết quan trọng"],
    "dont": ["So sánh tuổi thơ của hai người", "Vội vàng chuyển sang ảnh tiếp theo", "Phê bình cách gia đình người ấy nuôi dạy"]
  }'::jsonb,
  '["understanding", "vulnerability", "storytelling", "deep_connection"]'::jsonb,
  true
);

-- Activity 5: Evening Walk Around West Lake (Novelty + Connection)
INSERT INTO public.activities (
  slug,
  title_vi,
  title_en,
  description_vi,
  description_en,
  category,
  pillar,
  relationship_type,
  effort_level,
  time_required_minutes,
  location_type,
  city,
  cost_range,
  steps,
  conversation_prompts,
  tips,
  tags,
  is_active
) VALUES (
  'evening-walk-west-lake',
  'Đi bộ quanh Hồ Tây lúc hoàng hôn',
  'Evening Walk Around West Lake',
  'Tận hưởng hoàng hôn bên Hồ Tây, đi bộ và trò chuyện về những ước mơ tương lai',
  'Enjoy the sunset by West Lake, walk and talk about future dreams',
  'date',
  ARRAY['novelty', 'connection'],
  ARRAY['new', 'long_term'],
  'low',
  90,
  'outdoor',
  ARRAY['hanoi'],
  'free',
  '[
    {"order": 1, "instruction_vi": "Hẹn gặp lúc 17h30-18h để kịp hoàng hôn", "instruction_en": "Meet at 5:30-6pm to catch the sunset"},
    {"order": 2, "instruction_vi": "Bắt đầu từ khu vực Thanh Niên hoặc đường Âu Cơ", "instruction_en": "Start from Thanh Nien area or Au Co street"},
    {"order": 3, "instruction_vi": "Đi bộ chậm rãi, thỉnh thoảng dừng lại ngắm cảnh", "instruction_en": "Walk slowly, stop occasionally to enjoy the view"},
    {"order": 4, "instruction_vi": "Nếu thích, ghé một quán nước nhỏ để nghỉ chân", "instruction_en": "If you like, stop at a small cafe to rest"},
    {"order": 5, "instruction_vi": "Trò chuyện về những điều mới mẻ muốn thử", "instruction_en": "Talk about new things you want to try"}
  ]'::jsonb,
  '[
    {"prompt_vi": "Nơi nào bạn muốn đi du lịch cùng tôi nhất?", "prompt_en": "Where do you most want to travel with me?"},
    {"prompt_vi": "Một kỹ năng mới bạn muốn học là gì?", "prompt_en": "What new skill do you want to learn?"},
    {"prompt_vi": "5 năm nữa, bạn thấy chúng ta ở đâu?", "prompt_en": "In 5 years, where do you see us?"}
  ]'::jsonb,
  '{
    "do": ["Cầm tay nhau khi đi", "Chụp ảnh kỷ niệm", "Tìm một góc yên tĩnh để ngồi ngắm hoàng hôn"],
    "dont": ["Liên tục xem điện thoại", "Vội vàng về", "Chỉ nói về công việc hoặc stress"]
  }'::jsonb,
  '["outdoor", "romantic", "sunset", "hanoi", "nature", "future_talk"]'::jsonb,
  true
);
